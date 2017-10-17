var pool = require('./db-connection');

var wallabotMySQL = {};

wallabotMySQL.getItem = async function(item) {
    try {
        //Find item

        console.log(item.itemId);
        let itemData = await pool.query(
            `
            SELECT * FROM WALLA_ITEMS WHERE ID = ?
            `, [item.itemId]
        );

        return itemData[0];
    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallabotMySQL.getAllSearchCriteria = async function() {
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

wallabotMySQL.updateSearchCriteria = async function(criteria) {
    try {
        await pool.query(
            `
            UPDATE WALLA_SEARCHS SET LAST=sysdate() WHERE ID = ?
            `, [criteria.ID]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallabotMySQL.insertItem = async function(item) {
    try {
        await pool.query(
            `
            INSERT INTO WALLA_ITEMS (ID, TITLE, DESCRIPTION, PRICE) VALUES (?,?,?,?)
            `, [
                item.itemId, item.title, item.description, (item.price)
                .replace('€', '')]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallabotMySQL.insertSearchCriteria = async function(criteria) {
    try {
        await pool.query(
            `
            INSERT INTO WALLA_SEARCHS(KWS)
            VALUES (?)
            `, [criteria.KWS]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

wallabotMySQL.deleteSearchCriteria = async function(criteria) {
    try {
        await pool.query(
            `
            DELETE FROM WALLA_SEARCHS WHERE KWS = ?
            `, [criteria.KWS]
        );

    } catch (error) {
        console.log(error);
        //ctx.throw(400, 'INVALID_DATA');
    }
}

module.exports = wallabotMySQL;
