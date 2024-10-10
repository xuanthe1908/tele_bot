# Telegram Bot Project

This project implements a Telegram bot using Node.js. The bot can respond to predefined questions, handle custom queries using the ModelsLab API, and store user information in a SQL Server database.

## Features

- Responds to predefined questions
- Handles custom queries using ModelsLab's AI model
- Stores user information and start parameters in a SQL Server database
- Uses ngrok for exposing the local server to the internet

## Prerequisites

- Node.js
- SQL Server
- Telegram Bot Token
- ModelsLab API Key
- ngrok

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tele_bot.git
   cd tele_bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     BOT_TOKEN=Your_Telegram_Bot_Token
     MODELSLAB_API_KEY=Your_ModelsLab_API_Key
     ```

4. Configure SQL Server connection in `bot.js`:
   ```javascript
   const sqlConfig = {
     user: 'your_username',
     password: 'your_password',
     database: 'telegram_bot_db',
     server: 'your_server_name',
     options: {
       encrypt: true,
       trustServerCertificate: true,
     },
   };
   ```

## Usage

1. Start the bot:
   ```
   node bot.js
   ```

2. The console will display the ngrok URL. Use this URL to set up your Telegram bot's webhook.

3. Start chatting with your bot on Telegram!

## Main Components

- `bot.js`: The main bot logic
- SQL Server: Stores user information and start parameters
- ModelsLab API: Provides AI-powered responses for custom queries
- ngrok: Exposes the local server to the internet


