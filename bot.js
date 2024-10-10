const { Telegraf } = require('telegraf');
const axios = require('axios');
const sql = require('mssql');
const ngrok = require('ngrok');

const sqlConfig = { // Config SQL Server
  user: 'sa',
  password: '123',
  database: 'telegram_bot_db',
  server: 'DESKTOP-8CGBUL0',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

sql.connect(sqlConfig).catch(err => console.log('SQL Connection Error: ', err));
const botToken = 'Your_botToken';
const modelsLabApiKey = 'YOUR_MODELSLabApiKey';
const bot = new Telegraf(botToken);

const predefinedResponses = { //Config some question and answer available
  "hello": "Hello! How can I assist you today?",
  "how are you?": "I'm just a bot, but I'm doing great! How about you?",
  "what's your name?": "I'm your friendly bot, here to help!",
  "what can you do?": "I can chat with you, answer questions, and much more!",
  "tell me a joke": "Why don't programmers like nature? It has too many bugs.",
  "what is the weather today?": "I'm not equipped to check the weather yet, but I can still chat with you!",
  "who created you?": "I was created by a skilled developer to assist you!",
  "what is your purpose?": "My purpose is to provide information, answer questions, and make your day better.",
  "how do you work?": "I work by processing your text and giving you the best response I can!",
  "what is love?": "Love is an emotion that transcends everything, even bots like me can't fully grasp it!",
  "what is the meaning of life?": "The meaning of life is a question that's puzzled humans and bots alike for centuries!",
  "what is a variable?": "A variable is a way to store information in a program so it can be used and manipulated later.",
  "what is a function?": "A function is a block of code designed to perform a particular task, and it can be reused multiple times.",
  "what is an array?": "An array is a data structure that can hold multiple values in a single variable, often used to store lists.",
  "what is an object?": "An object is a collection of properties, where each property is defined as a key-value pair.",
  "what is a loop?": "A loop is a programming construct that repeats a block of code until a condition is met.",
  "what is an if statement?": "An 'if' statement is a conditional statement that runs a block of code only if a specified condition is true.",
  "what is recursion?": "Recursion is a process where a function calls itself in order to solve a problem in smaller chunks.",
  "what is an API?": "API stands for Application Programming Interface, a set of rules that allows different software entities to communicate with each other.",
  "what is a class?": "A class is a blueprint for creating objects in object-oriented programming, defining properties and behaviors.",
  "what is async/await?": "Async/await is syntax used in JavaScript to handle asynchronous code in a more readable way than using callbacks or promises.",
  "what is a promise?": "A promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.",
  "what is npm?": "npm (Node Package Manager) is the default package manager for Node.js, used to manage and share code modules.",
  "how do i start learning programming?": "Start by picking a programming language like Python or JavaScript, and work on small projects to build up your skills.",
  "what is git?": "Git is a version control system used for tracking changes in code during software development.",
  "what is github?": "GitHub is a platform for hosting and collaborating on code projects using Git for version control.",
  "who is the manager of manchester united?": "As of now, the manager of Manchester United is Erik ten Hag.",
  "how many premier league titles has manchester united won?": "Manchester United has won 20 Premier League titles, the most in English football history.",
  "who is the top goal scorer for manchester united?": "Wayne Rooney holds the record as Manchester United's all-time top goal scorer with 253 goals.",
  "who are manchester united's main rivals?": "Manchester United's main rivals are Manchester City, Liverpool, Arsenal, and Leeds United.",
  "when was manchester united founded?": "Manchester United was founded in 1878 as Newton Heath LYR Football Club and was renamed Manchester United in 1902.",
  "what is the home stadium of manchester united?": "Manchester United's home stadium is Old Trafford, often called 'The Theatre of Dreams.'",
  "how many champions league titles has manchester united won?": "Manchester United has won the UEFA Champions League three times: in 1968, 1999, and 2008."
};

bot.start(async (ctx) => {
  const username = ctx.from.username || null;
  const userId = ctx.from.id;
  const identifier = username ? username : `User ID: ${userId}`;
  const startParam = ctx.startPayload || 'No payload provided';

  try {
    const request = new sql.Request();
    await request.input('username', sql.VarChar, identifier)
                 .input('param_value', sql.VarChar, startParam)
                 .query(`
      INSERT INTO UserParams (username, param_value) VALUES (@username, @param_value)
    `);
    ctx.reply(`Welcome, ${identifier}! The value ${startParam} has been saved.`);
  } catch (err) {
    console.error('Error while inserting into database:', err);
    ctx.reply('Error while inserting into database.');
  }
});

bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text.toLowerCase();

  let foundResponse = null;
  for (const [keyword, response] of Object.entries(predefinedResponses)) {
    if (userMessage.includes(keyword)) {
      foundResponse = response;
      break;
    }
  }

  if (foundResponse) {
    ctx.reply(foundResponse);
  } else {
    try {
      const response = await axios.post('https://modelslab.com/api/v6/llm/uncensored_chat', {
        key: modelsLabApiKey,
        model_id: 'zephyr-7b-beta',
        prompt: userMessage,
        max_tokens: 600,
        do_sample: true,
        temperature: 1.0,
        top_k: 50,
        top_p: 0.95,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.output && Array.isArray(response.data.output)) {
        ctx.reply(response.data.output[0]);
      } else {
        ctx.reply('Sorry, I was unable to retrieve a proper response.');
      }
    } catch (error) {
      console.error('Error while calling ModelsLab API:', error.response ? error.response.data : error.message);
      ctx.reply('There was an error while calling the ModelsLab API.');
    }
  }
});

(async function() {
  const url = await ngrok.connect(3000);
  console.log(`Ngrok URL: ${url}`);
})();

bot.launch();
console.log('The bot is running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
