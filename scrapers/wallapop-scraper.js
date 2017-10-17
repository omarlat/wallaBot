//Dependencies
const https = require('https');
const wallabotMySQL = require('../db/wallabot-mysql.js');
const wallabotFirebase = require('../db/wallabot-firebase.js');
const wallabotUtils = require("../utils/wallabot-utils.js");

let wallapopScraper = {};

wallapopScraper.execute = async function(cb) {

    let wallabotDB;
    if (process.env.DB_VENDOR === "MYSQL") {
        wallabotDB = wallabotMySQL;
    } else if (process.env.DB_VENDOR === "FIREBASE") {
        wallabotDB = wallabotFirebase;
    } else {
        throw new Error("Can't init DB!");
    }

    wallabotDB.getAllSearchCriteria()
        .then(criterias => {
            console.log("search criteria: " + JSON.stringify(criterias));
            if (criterias && criterias.length > 0) {
                for (let idx in criterias) {
                    const criteria = criterias[0];
                    let options = wallabotUtils.getURLOptions(criteria);

                    console.log("URL: " + options.path);
                    https.request(options, res => {
                            var body = '';
                            res.on('data', chunk => {
                                body += chunk;
                            });

                            res.on('end', async function() {
                                var result = JSON.parse(body);
                                var messages = [];
                                if (result.items.length > 0) {
                                    for (var idx in result.items) {
                                        item = result.items[idx];
                                        itemDB = await wallabotDB.getItem(item);
                                        if (itemDB === undefined) {
                                            messages.push('<a href="https://es.wallapop.com/item/' +
                                                item.url +
                                                '">Resultado de ' + criteria.KWS + ' > ' + item
                                                .price +
                                                ' en ' +
                                                item.itemLocation.city + '</a>');
                                            await wallabotDB.insertItem(item);
                                        }
                                    }
                                } else {
                                    console.log('Sin resultados en la busqueda de wallapop');
                                }
                                //await wallabotDB.updateSearchCriteria(criteria);
                                cb(null, messages);
                            });

                            res.on('error', cb);
                        }, error => console.error(error))
                        .on('error', cb)
                        .end();
                }
            }
        })
        .catch(console.error);

}

module.exports = wallapopScraper;
