var Datastore = require('nedb');

var db = {};

db.items = new Datastore({
    filename: './db/items.db',
    autoload: true
});
db.searches = new Datastore({
    filename: './db/searches.db',
    autoload: true
});

var amazonModel = {};


amazonModel.getItem = async function (search_id) {
    return new Promise(function (resolve, reject) {
        db.items.findOne({
            search_id: search_id
        }, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    });
}

amazonModel.getSearchs = async function () {
    return new Promise(function (resolve, reject) {
        db.searches.find({})
            .sort({
                last: -1
            }).exec(function (err, docs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
    });
}

amazonModel.getItems = async function (chatId) {
    return new Promise(function (resolve, reject) {
        db.items.find({chat_id: chatId}, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    });
}

amazonModel.updateSearch = async function (search) {
    return new Promise(function (resolve, reject) {
        db.searches.update({
            id: search
        }, {
            last: new Date()
        }, function (err, numReplaced) {
            if (err) {
                reject(err);
            } else {
                resolve(numReplaced);
            }
        })
    });
}

amazonModel.insertItem = async function (search_id, item_id, chat_id, price, title) {
    var item = {
        search_id: search_id,
        item_id: item_id,
        chat_id: chat_id,
        price: price.replace(',', '.'),
        title: title
    };

    return new Promise(function (resolve, reject) {
        db.items.insert(item, function (err, newDoc) {
            if (err) {
                reject(err);
            } else {
                resolve(newDoc);
            }
        })
    });
}

amazonModel.updateItem = async function (search_idid, price) {
    return new Promise(function (resolve, reject) {
        db.items.update({
            search_id: search_id
        }, {
            price: price
        }, {}, function (err, numReplaced) {
            if (err) {
                reject(err);
            } else {
                resolve(numReplaced);
            }
        })
    });
}

amazonModel.insertSearch = async function (item_id, chat_id) {
    var search = {
        item_id: item_id,
        chat_id: chat_id,
        last: new Date()
    };
    return new Promise(function (resolve, reject) {
        db.searches.insert(search, function (err, newDoc) {
            if (err) {
                reject(err);
            } else {
                resolve(newDoc);
            }
        })
    });
}

amazonModel.deleteSearch = async function (item_id, chat_id) {
    return new Promise(function (resolve, reject) {
        db.searches.remove({
            item_id: item_id,
            chat_id: chat_id
        }, {}, function (err, numRemoved) {
            if (err) {
                reject(err);
            } else {
                resolve(numRemoved);
            }
        })
    });
}

module.exports = amazonModel;
