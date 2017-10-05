var pool=require('../dbconnection');

var wallapopModel = {};


wallapopModel.getItem = async function(item) {
    try {
        //Find item

				console.log(item.itemId);
        let itemData = await pool.query(
            `
            SELECT * FROM WALLA_ITEMS WHERE ID = ?
            `,
            [item.itemId]
        );

        return itemData[0];
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallapopModel.getSearchs = async function() {
    try {
        //Find item

        let itemData = await pool.query(
            `
            SELECT * FROM WALLA_SEARCHS ORDER BY LAST ASC
            `
        );

        return itemData;
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallapopModel.updateSearch = async function(item) {
    try {
        await pool.query(
            `
            UPDATE WALLA_SEARCHS SET LAST=sysdate() WHERE ID = ?
            `,
            [item]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallapopModel.insertItem = async function(item) {
    try {
        await pool.query(
            `
            INSERT INTO WALLA_ITEMS (ID, TITLE, DESCRIPTION, PRICE) VALUES (?,?,?,?)
            `,
            [item.itemId, item.title, item.description,(item.price).replace('€','')]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallapopModel.insertSearch = async function(kws) {
    try {
        await pool.query(
            `
            INSERT INTO WALLA_SEARCHS(KWS)
            VALUES (?)
            `,
            [kws]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallapopModel.deleteSearch = async function(kws) {
    try {
        await pool.query(
            `
            DELETE FROM WALLA_SEARCHS WHERE KWS = ?
            `,
            [kws]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

module.exports = wallapopModel;
