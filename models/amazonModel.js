var pool = require('../dbconnection');
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


amazonModel.getItem = async function (item) {
    try {
        //Find item
        let item = await db.users.find({
            id: item
        }, function (err, docs) {
            if (docs.length > 0) {
                return docs[0];
            } else {
                console.log("No results found");
                return {};
            }
        });

        return item;
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.getSearchs = async function () {
    try {
        //Find item

        let searches = await db.searches.find({}, function (err, docs) {
            return docs;
        });

        return searches;

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.getItems = async function (chatId) {
    try {
        //Find item

        let items = await db.items.find({}, function (err, docs) {
            return docs;
        });

        return items;

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.updateSearch = async function (search) {
    try {

        await db.searches.update({
            id: search
        }, {
            last: new Date()
        }, {}, function (err, numReplaced) {
            console.log("registros actualizados: " + numReplaced);
        });

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.insertItem = async function (_id, _item_id, _chat_id, _price, _title) {
    try {
        var item = {
            id: _id,
            item_id: _item_id,
            chat_id: _chat_id,
            price: _price.replace(',', '.'),
            title: _title
        };
        await db.items.insert(item, function (err, newDoc) {
            console.log("New item inserted: " + JSON.stringify(item));
        });

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.updateItem = async function (_id, _price) {
    try {

        await db.items.update({
            id: _id
        }, {
            price: _price
        }, {}, function (err, numReplaced) {
            console.log("registros actualizados: " + numReplaced);
        });

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.insertSearch = async function (_item_id, _chat_id) {
    try {

        var search = {
            _item_id: _item_id,
            _chat_id: _chat_id
        };
        await db.searches.insert(search, function (err, newDoc) {
            console.log("New search inserted: " + JSON.stringify(search));
        });

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.deleteSearch = async function (_item_id, _chat_id) {
    try {

        await db.searches.remove({
            item_id: _item_id,
            chat_id: _chat_id
        }, {}, function (err, numRemoved) {
            console.log("Searches removed: " + numRemoved);
        });

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

module.exports = amazonModel;