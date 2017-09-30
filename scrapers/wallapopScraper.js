var https = require('https');
var wallapopModel = require('../models/wallapopModelAsync.js');
var wallapopScraper = {};

var options = {
  host: 'es.wallapop.com',
  port: 443,
  path: '/rest/items?kws=x-men&lat=43.308567&lng=-2.994161000000001&minPrice=&maxPrice=&dist=20&markAsIds=&publishDate=7&verticalId=&order=creationDate-des',
  method: 'GET'
}

wallapopScraper.execute = function(cb){
  https.request(options, function(res){
    console.log("status code: ", res.statusCode);
    var body = '';
    res.on('data', function(chunk){
      body+=chunk;
    });

    res.on('end', async function(){
      var result = JSON.parse(body);
      var messages = [];
      if(result.items.length>0){
        //messages.push('<b>Búsqueda de x-men con '+result.items.length+' resultados</b>');
        for (var i = 0; i < result.items.length; i++) {
          item  = await wallapopModel.getItem(result.items[i]);
          if(item=== undefined){
              console.log('Item dont exists;');
              await wallapopModel.insertItem(result.items[i]);
              messages.push('<a href="https://es.wallapop.com/item/'+result.items[i].url+'">('+eval(i+1)+' de '+result.items[i].length+') > '+result.items[i].price+' en '+result.items[i].itemLocation.city+'</a>');
            }
        }
      }else{
        console.log('Sin resultados en la busqueda de wallapop');
      }
      cb(null, messages);
    });

    res.on('error', cb);
  })
  .on('error', cb)
  .end();
}

module.exports = wallapopScraper;
