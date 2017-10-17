//Dependencies
const wallabotMySQL = require('../db/wallabot-mysql.js');
const wallabotFirebase = require('../db/wallabot-firebase.js');

//Private functions
function zeroPad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1)
    .join(z) + n;
}


//Wallabot Utils API
var wallabotUtils = {};

wallabotUtils.getDateYYYYMMDD = function() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    return parseInt(year + '' + zeroPad(month, 2) + '' + zeroPad(day, 2));
}

wallabotUtils.wait = function(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    });
}

wallabotUtils.getURLOptions = function(criteria){
    return {
        host: 'es.wallapop.com',
        port: 443,
        path: '/rest/items?kws=' + (criteria.KWS)
            .replace(' ', '%20') + '&lat=' + criteria.LAT + '&lng=' + criteria.LONG +
            '&minPrice=&maxPrice=&dist=' + criteria.DIST + '&markAsIds=&publishDate=' +
            criteria.PUBLISHDATE +
            '&verticalId=&order=creationDate-des',
        method: 'GET'
    }
}

module.exports = wallabotUtils;
