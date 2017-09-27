var https = require('https');
var wallapopScraper = {};


wallapopScraper.getResults = function(options, cb){
  https.request(options, function(res){
    console.log("status code: ", res.statusCode);
    var body = '';
    res.on('data', function(chunk){
      body+=chunk;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      if(result.items.length>0){
        var messages = [];
        messages.push('<b>Búsqueda de x-men con '+result.items.length+' resultados</b>');
        for (var i = 0; i < result.items.length; i++) {
          messages.push('<a href="https://es.wallapop.com/item/'+result.items[i].url+'">('+eval(i+1)+' de '+result.items.length+') > '+result.items[i].price+' en '+result.items[i].itemLocation.city+'</a>');
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
