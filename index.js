const { exec } = require('child_process');
require("dotenv").config();

const chatIds = [];

const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

async function sendMessage(chatId, message) {
  try {
    console.log("trying to send message to all subscribers");
    const data = await retrieveData(url);
    const formattedMessage = `${data
      .map((item) => `- ${item.phoneType}: ${item.price}`)
      .join("\n")}`;

    console.log(formattedMessage);
    chatIds.forEach(async (chatId) => {
      bot.sendMessage(chatId, formattedMessage);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!chatIds.includes(chatId)) {
    chatIds.push(chatId);
    console.log(chatId + " subscribed");
  }

  var httpRegex =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  const messageText = (msg && msg.text) ? msg.text : '';

  // Split the message by spaces
  const parts =messageText.split(' ');
  const commandString = parts[0];
  const commandParameterString = parts[1];
  const ebayAlertCommand = "/home/reini/miniconda3/bin/python -m ebAlert";
  const commandList = ['/add', '/list', '/remove'];

  if (!commandList.includes(parts[0])) {
    return;
  }

  if (commandString === '/add') {
    if (httpRegex.test(commandParameterString)) {
      exec(ebayAlertCommand + ' links -a ' + commandParameterString, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          sendMessage(chatId, `exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        sendMessage(chatId, `stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });

    }
    else {
      sendMessage(chatId, "der parameter muss ein valider link sein!")
    }
  }
  else if (commandString === '/list') {
    exec(ebayAlertCommand + ' links -s', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        sendMessage(chatId, `exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      sendMessage(chatId, `stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  }
  else if (commandString === '/remove') {
    exec(ebayAlertCommand + ' links -r ' + commandParameterString, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        sendMessage(chatId, `exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      sendMessage(chatId, `stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

  }

});