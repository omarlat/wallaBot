//Dependencies
const env = require('env2')('./.env');
const wallapopScraper = require('./scrapers/wallapop-scraper.js');
const bot = require('./bot/bot.js');
const CronJob = require('cron').CronJob;

new CronJob('00 */1 * * * *', function() {
    wallapopScraper.execute(function(err, messages) {
        if (err) {
            return console.log('Error while trying to get wallapop results: ', err);
        } else {
            if (messages && messages.length > 0) {
                console.log("Enviando mensajes. Total a enviar: " + messages.length);
                bot.sendMessages(messages);
            } else {
                console.log("No ha habido resultados.")
            }
        }
    });
}, null, true, 'Europe/Madrid');
