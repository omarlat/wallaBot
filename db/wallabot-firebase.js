//Dependencies
const firebase = require("firebase-admin");
const serviceAccount = require('./service-account.json');
const wallabotUtils = require("../utils/wallabot-utils.js");

//DB Setup
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://wallabot-12603.firebaseio.com"
});

//Database refs
const db = firebase.database();
const items = db.ref("items/");
const searchCriteria = db.ref("search-criteria/");

//Private functions
function getAllSearchCriteria() {
    return new Promise(resolve => {
        searchCriteria.once('value', function(snapshot) {
            let searches = [];
            searches.push(snapshot.val());
            resolve(searches);
        }, function(err){
            console.error("Error en getAllSearchCriteria ", err);
        });
    });
}

function insertSearchCriteria(criteria) {
    return new Promise(resolve => {
        searchCriteria.set({
            KWS: criteria.KWS,
            DIST: criteria.dist || 20,
            MINPRICE: criteria.minPrice || null,
            MAXPRICE: criteria.maxPrice || null,
            PUBLISHDATE: criteria.publishDate || 24,
            LONG: criteria.long || '-2.9349852',
            LAT: criteria.lat || '43.2630126',
            LAST: wallabotUtils.getDateYYYYMMDD()
        })
        resolve(criteria);
    });
}

function updateSearchCriteria(criteria) {
    return new Promise(resolve => {
        searchCriteria
            .once("value", snapshot => {
                console.log("updateSearchCriteria snapshot: "+JSON.stringify(snapshot.val()));
                
                resolve(criteria);
            });
    });
}

function insertItem(item) {
    return new Promise(resolve => {
        db.ref('items/' + item.itemId)
            .set({
                ID: item.itemId,
                TITLE: item.title,
                DESCRIPTION: item.description,
                PRICE: (item.price)
                    .replace('€', '')
            })
            .then(function(i) {
                resolve(i);
            })
            .catch(function(err) {
                console.error("insertItem error", err);
            });
    });
}


//Wallabot Firebase API
var wallabotFirebase = {};

wallabotFirebase.getItem = async function(item) {
    db.ref('items/' + item.itemId)
        .once('value')
        .then(function(snapshot) {
            return snapshot;
        })
        .catch(function(err) {
            console.error("getItem error", err);
        });
}

wallabotFirebase.insertItem = async function(item) {
    return insertItem(item);
}

wallabotFirebase.getAllSearchCriteria = async function() {
    return getAllSearchCriteria();
}

wallabotFirebase.insertSearchCriteria = async function(criteria) {
    console.log("insertSearchCriteria " + JSON.stringify(criteria));
    return insertSearchCriteria(criteria);
}

wallabotFirebase.updateSearchCriteria = async function(criteria) {
    return updateSearchCriteria(criteria);
}

module.exports = wallabotFirebase;
