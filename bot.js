var TelegramBot = require('node-telegram-bot-api');
var telegramToken = process.env.TG_TOKEN;
var telegramChatId = process.env.TG_CHAT_ID;
var bot = new TelegramBot(telegramToken, {polling: true});
var amazonModel = require('./models/amazonModel.js');

var myBot = {};

function wait (timeout){
  return new Promise((resolve) =>{
    setTimeout(() =>{
      resolve()
    }, timeout)
  });
}


myBot.sendMessages = async function (messages, chatId){
  for (var i = 0; i < messages.length; i++) {
    const timeout = 1000;
    await wait(timeout);
    bot.sendMessage(chatId, messages[i], {parse_mode: "html"});
  }
}

bot.on('text', async function (msg) {
  var chat_id = msg.chat.id;
  var text = msg.text;
  console.log(chat_id);
    if(text.toLowerCase().startsWith("add")){
      var item_id = text.substr(4);
      amazonModel.insertSearch(item_id, chat_id);
      bot.sendMessage(chat_id,'Busqueda de '+item_id+' añadida');
    }else if(text.toLowerCase().startsWith("remove")){
        var item_id = text.substr(7);
        amazonModel.deleteSearch(item_id, chat_id);
        bot.sendMessage(chat_id,'Busqueda de '+item_id+' eliminada');
    }else if(text.toLowerCase() == "list"){
        items = await amazonModel.getItems(chat_id);
        items.forEach( (item) => {
          bot.sendMessage(chat_id, item.title +': '+item.item_id+' > '+item.price+'€');
        });
    }
    else{
      bot.sendMessage(chat_id,"No entiendo tu orden");
    }
});



module.exports = myBot;
