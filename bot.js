var TelegramBot = require('node-telegram-bot-api');
var telegramToken = process.env.TG_TOKEN;
var telegramChatId = process.env.TG_CHAT_ID;
var bot = new TelegramBot(telegramToken, {polling: false});

var myBot = {};

function wait (timeout){
  return new Promise((resolve) =>{
    setTimeout(() =>{
      resolve()
    }, timeout)
  });
}


myBot.sendMessages = async function (messages){
  for (var i = 0; i < messages.length; i++) {
    const timeout = 1000;
    await wait(timeout);
    bot.sendMessage(telegramChatId, messages[i], {parse_mode: "html"});
  }
}

module.exports = myBot;
