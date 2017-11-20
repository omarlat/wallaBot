var pool=require('../dbconnection');

var amazonModel = {};


amazonModel.getItem = async function(item) {
    try {
        //Find item
        let itemData = await pool.query(
            `
            SELECT * FROM AMAZON_ITEMS WHERE ID = ?
            `,
            [item]
        );

        return itemData[0];
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.getSearchs = async function() {
    try {
        //Find item

        let itemData = await pool.query(
            `
            SELECT * FROM AMAZON_SEARCHS ORDER BY LAST ASC
            `
        );

        return itemData;
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.updateSearch = async function(item) {
    try {
        await pool.query(
            `
            UPDATE AMAZON_SEARCHS SET LAST=sysdate() WHERE ID = ?
            `,
            [item]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.insertItem = async function(id, item_id, chat_id, price, title) {
    try {
        await pool.query(
            `
            INSERT INTO AMAZON_ITEMS (ID, ITEM_ID, CHAT_ID, PRICE, TITLE) VALUES (?,?,?,?,?)
            `,
            [id, item_id, chat_id, (price).replace(',','.'), title]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.updateItem = async function(id, price) {
    try {
        await pool.query(
            `
            UPDATE AMAZON_ITEMS SET PRICE= ?  WHERE ID = ?
            `,
            [price, id]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.insertSearch = async function(item_id, chat_id) {
    try {
        await pool.query(
            `
            INSERT INTO AMAZON_SEARCHS(ITEM_ID, CHAT_ID)
            VALUES (?,?)
            `,
            [item_id, chat_id]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

amazonModel.deleteSearch = async function(item_id, chat_id) {
    try {
        await pool.query(
            `
            DELETE FROM AMAZON_SEARCHS WHERE ITEM_ID = ? AND CHAT_ID = ?
            `,
            [item_id, chat_id]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

module.exports = amazonModel;
