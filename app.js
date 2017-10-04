const env = require('env2')('./.env');
var wallapopScraper = require('./scrapers/wallapopScraper.js');
var bot = require('./bot.js');
var CronJob = require('cron').CronJob;



new CronJob('00 */5 * * * *', function() {
  wallapopScraper.execute(function(err, messages){
    if(err){
      return console.log('Error while trying to get wallapop results: ', err);
    }else{
      bot.sendMessages(messages);
    }
  });
}, null, true, 'Europe/Madrid');
