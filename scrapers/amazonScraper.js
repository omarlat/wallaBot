var https = require('https');
var cheerio = require('cheerio');
var amazonModel = require('../models/amazonModel.js');
var amazonScraper = {};

amazonScraper.execute = async function(cb){

  searchs  = await amazonModel.getSearchs();
  search = searchs[0];
  var options = {
    host: 'www.amazon.es',
    port: 443,
    path: '/gp/product/'+(search.ITEM_ID),
    method: 'GET'
  }
  console.log(options.path);
  https.request(options, function(res){
    console.log("status code: ", res.statusCode);
    var body = '';
    res.on('data', function(chunk){
      body+=chunk;
    });

    res.on('end', async function(){
      var $ = cheerio.load(body);
      var price = "";
      var title = $("title").text()
      $('.a-span12 span.a-size-medium.a-color-price').each(function(i, element) {
          var el = $(this);
          price = el.text().replace('EUR ','').replace(',','.');
          console.log(price);
      })
      var messages = [];
      if(price!=""){
          item  = await amazonModel.getItem(search.ID);
          if(item=== undefined){
              await amazonModel.insertItem(search.ID, search.ITEM_ID, search.CHAT_ID, price, title);
              messages.push('<a href="https://www.amazon.es/gp/product/'+search.ITEM_ID+'">PRECIO ACTUAL DE '+title+': '+price+'€</a>');
          }else if(item.PRICE>price){
              await amazonModel.updateItem(search.ID, price);
              messages.push('<a href="https://www.amazon.es/gp/product/'+search.ITEM_ID+'">BAJADA DE PRECIO DE '+title+' de '+item.PRICE+'€ a '+price+'€</a>');
          }
      }else{
        console.log('Sin resultados de precio');
      }
      await amazonModel.updateSearch(search.ID);
      cb(null, messages, search.CHAT_ID);
    });

    res.on('error', cb);
  })
  .on('error', cb)
  .end();
}

module.exports = amazonScraper;
