var https = require('https');
var wallapopModel = require('../models/wallapopModel.js');
var wallapopScraper = {};

wallapopScraper.execute = async function(cb){

  searchs  = await wallapopModel.getSearchs();
  search = searchs[0];
  var options = {
    host: 'es.wallapop.com',
    port: 443,
    path: '/rest/items?kws='+(search.KWS).replace(' ','%20')+'&lat='+search.LAT+'&lng='+search.LONG+'&minPrice=&maxPrice=&dist='+search.DIST+'&markAsIds=&publishDate='+search.PUBLISHDATE+'&verticalId=&order=creationDate-des',
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
      var result = JSON.parse(body);
      var messages = [];
      if(result.items.length>0){
        for (var i = 0; i < result.items.length; i++) {
          item  = await wallapopModel.getItem(result.items[i]);
          if(item=== undefined){
              await wallapopModel.insertItem(result.items[i]);
              messages.push('<a href="https://es.wallapop.com/item/'+result.items[i].url+'">Resultado de '+search.KWS+' > '+result.items[i].price+' en '+result.items[i].itemLocation.city+'</a>');
            }
        }
      }else{
        console.log('Sin resultados en la busqueda de wallapop');
      }
      await wallapopModel.updateSearch(search.ID);
      cb(null, messages);
    });

    res.on('error', cb);
  })
  .on('error', cb)
  .end();
}

module.exports = wallapopScraper;
