var db=require('../dbconnection');

var wallapopModel = {};

wallapopModel.getSearchs = function(callback)
{
		db.query('SELECT * FROM WALLA_SEARCHS ORDER BY ID', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
}

wallapopModel.getItem = function(item,callback){

		var sql = 'SELECT * FROM WALLA_ITEMS WHERE ID = ?';
		var id = item.itemId;
		console.log(id);
		db.query(sql, [id],function(error, row)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row, item);
			}
		});

}

wallapopModel.insertItem = function(item,callback)
{

		var sql = 'INSERT INTO WALLA_ITEMS (ID, TITLE, DESCRIPTION, PRICE) VALUES (?,?,?,?)';
		db.query(sql, [item.itemId, item.title, item.description,item.price],function(error, row)
		{
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, row);
			}
		});

}

module.exports = wallapopModel;
