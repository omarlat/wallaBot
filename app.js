const env = require('env2')('./.env');
var wallapopScraper = require('./scrapers/wallapopScraper.js');
var bot = require('./bot.js');

var options = {
  host: 'es.wallapop.com',
  port: 443,
  path: '/rest/items?kws=x-men&lat=43.308567&lng=-2.994161000000001&minPrice=&maxPrice=&dist=20&markAsIds=&publishDate=7&verticalId=&order=creationDate-des',
  method: 'GET'
}

wallapopScraper.getResults(options, function(err, messages){
  if(err){
    return console.log('Error while while trying to get wallapop results: ', err);
  }else{
    bot.sendMessages(messages);
  }
});
