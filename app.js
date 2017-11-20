const env = require('env2')('./.env');
var amazonScraper = require('./scrapers/amazonScraper.js');
var bot = require('./bot.js');
var CronJob = require('cron').CronJob;



new CronJob('00 */1 * * * *', function() {
  /*wallapopScraper.execute(function(err, messages){
    if(err){
      return console.log('Error while trying to get wallapop results: ', err);
    }else{
      bot.sendMessages(messages);
    }
  });*/

  amazonScraper.execute(function(err, messages, chatId){
    if(err){
      return console.log('Error while trying to get amazon results: ', err);
    }else{
      bot.sendMessages(messages, chatId);
    }
  });
}, null, true, 'Europe/Madrid');
