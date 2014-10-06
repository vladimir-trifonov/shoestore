var mongoose = require('mongoose'),
	file = require('../common/filesController');

var itemInStockSchema = mongoose.Schema({
	String: { type: Number, min: 0 }
}, { _id: false });

var itemSchema = mongoose.Schema({
	name: String,
	imgUrl: String,
	price: Number,
	inStock: [ItemInStock],
	pendingTransactions: [String]
});

var ItemInStock = mongoose.model('ItemInStock', itemInStockSchema);
var Item = mongoose.model('Item', itemSchema);

module.exports = {
	seedInitializeData: function(config) {
		'use strict';

		Item.find({}).exec(function(err, collection) {
			if (err) {
				console.log('Cannot find items: ' + err);
				return;
			}

			//Item.remove({}, function () {
			if (collection.length === 0) {
				var fullPath = file.getDataFilePath('itemsCollection.js', config.dataDirPath);
				file.readFile(fullPath).then(function(data) {
					return file.jsonParse(data);
				}).then(function(jsonData) {
					if (jsonData.length > 0) {
						Item.create(jsonData);
						console.log("Items added to db!");
					}
				});
			}
			//});
		})
	}
}