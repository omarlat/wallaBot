//Dependencies
const TelegramBot = require('node-telegram-bot-api');
const wallabotMySQL = require('../db/wallabot-mysql.js');
const wallabotFirebase = require('../db/wallabot-firebase.js');
const wallabotUtils = require("../utils/wallabot-utils.js");

//Constants
const telegramToken = process.env.TG_TOKEN;
const telegramChatId = process.env.TG_CHAT_ID;

let wallabotDB;
if (process.env.DB_VENDOR === "MYSQL") {
    wallabotDB = wallabotMySQL;
} else if (process.env.DB_VENDOR === "FIREBASE") {
    wallabotDB =  wallabotFirebase;
} else{
    throw new Error("Can't init DB!");
}

const bot = new TelegramBot(telegramToken, { polling: true });

bot.on('text', async function(msg) {
    console.log("New message: " + JSON.stringify(msg));
    const chatId = msg.chat.id;
    let text = msg.text.toLowerCase();

    if (chatId == telegramChatId) {
        if (text.startsWith("add")) {
            var kws = text.substr(4);
            var criteria = { 'KWS': kws };
            await wallabotDB.insertSearchCriteria(criteria);
            bot.sendMessage(chatId, 'Búsqueda de ' + kws + ' añadida.');
        } else if (text.startsWith("remove")) {
            var kws = text.substr(7);
            wallabotDB.deleteSearchCriteria(kws);
            bot.sendMessage(chatId, 'Búsqueda de ' + kws + ' eliminada.');
        } else if (text == "list") {
            searches = await wallabotDB.getAllSearchCriteria();
            for (var idx in searches) {
                bot.sendMessage(chatId, "Búsqueda "+ parseInt(idx + 1) +": \""+searches[0].KWS+"\"");
            }
        } else {
            bot.sendMessage(chatId, "No entiendo tu orden");
        }
    }
});

//MyBot API
let myBot = {};
const timeout = 1000;

myBot.sendMessages = async function(messages) {
    for (let idx in messages) {
        await wallabotUtils.wait(timeout);
        bot.sendMessage(telegramChatId, messages[idx], { parse_mode: "html" });
    }
}

module.exports = myBot;
