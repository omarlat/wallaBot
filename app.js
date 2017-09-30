const env = require('env2')('./.env');
var wallapopScraper = require('./scrapers/wallapopScraper.js');
var bot = require('./bot.js');
var wallapopModel = require('./models/wallapopModel.js');
var pool=require('./dbconnection');


wallapopScraper.execute(function(err, messages){
  if(err){
    return console.log('Error while trying to get wallapop results: ', err);
  }else{
    bot.sendMessages(messages);
    pool.end();
  }
});
