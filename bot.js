var TelegramBot = require('node-telegram-bot-api');
var telegramToken = process.env.TG_TOKEN;
var telegramChatId = process.env.TG_CHAT_ID;
var bot = new TelegramBot(telegramToken, {polling: true});
var wallapopModel = require('./models/wallapopModel.js');

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

bot.on('text', async function (msg) {
  var chatId = msg.chat.id;
  var text = msg.text.toLowerCase();
  if(chatId ==telegramChatId){
    if(text.startsWith("add")){
      var kws = text.substr(4);
      wallapopModel.insertSearch(kws);
      bot.sendMessage(chatId,'Busqueda de '+kws+' añadida');
    }else if(text.startsWith("remove")){
        var kws = text.substr(7);
        wallapopModel.deleteSearch(kws);
        bot.sendMessage(chatId,'Busqueda de '+kws+' eliminada');
    }else if(text == "list"){
        searchs  = await wallapopModel.getSearchs();
        for (var i = 0; i < searchs.length; i++) {          
            bot.sendMessage(chatId,searchs[i].KWS);
        }
    }
    else{
      bot.sendMessage(chatId,"No entiendo tu orden");
    }
  }
});



module.exports = myBot;
