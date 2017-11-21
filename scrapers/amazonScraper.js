var https = require('https');
var cheerio = require('cheerio');
var amazonModel = require('../models/amazonModel.js');
var amazonScraper = {};

amazonScraper.execute = async function (cb) {

  searchs = await amazonModel.getSearchs();

  console.log("searches data: " + JSON.stringify(searchs));

  if (searchs && searchs.length > 0) {
    search = searchs[0];
    var options = {
      host: 'www.amazon.es',
      port: 443,
      path: '/gp/product/' + (search.item_id),
      method: 'GET'
    }
    console.log(options.path);
    https.request(options, function (res) {
        console.log("status code: ", res.statusCode);
        var body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', async function () {
          var $ = cheerio.load(body);
          var price = "";
          var title = $("title").text()
          $('.a-span12 span.a-size-medium.a-color-price').each(function (i, element) {
            var el = $(this);
            price = el.text().replace('EUR ', '').replace(',', '.');
            console.log(price);
          })
          var messages = [];
          if (price != "") {
            item = await amazonModel.getItem(search.id);
            if (item === undefined) {
              await amazonModel.insertItem(search.id, search.item_id, search.chat_id, price, title);
              messages.push('<a href="https://www.amazon.es/gp/product/' + search.item_id + '">PRECIO ACTUAL DE ' + title + ': ' + price + '€</a>');
            } else if (item.price > price) {
              await amazonModel.updateItem(search.id, price);
              messages.push('<a href="https://www.amazon.es/gp/product/' + search.item_id + '">BAJADA DE PRECIO DE ' + title + ' de ' + item.price + '€ a ' + price + '€</a>');
            } else if (item.price < price) {
              await amazonModel.updateItem(search.id, price);
              messages.push('<a href="https://www.amazon.es/gp/product/' + search.item_id + '">SUBIDA DE PRECIO DE ' + title + ' de ' + item.price + '€ a ' + price + '€</a>');
            }
          } else {
            console.log('Sin resultados de precio');
          }
          await amazonModel.updateSearch(search.id);
          cb(null, messages, search.chat_id);
        });

        res.on('error', cb);
      })
      .on('error', cb)
      .end();
  }

}

module.exports = amazonScraper;