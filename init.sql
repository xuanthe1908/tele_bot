CREATE DATABASE telegram_bot_db;

USE telegram_bot_db;

CREATE TABLE UserParams (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(255) NOT NULL,
    param_value VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

SELECT * FROM UserParams;
