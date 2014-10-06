var mongoose = require('mongoose'),
	Item = require("../models/Item"),
	Order = require("../models/Order"),
	Transaction = require("../models/Transaction");

module.exports = function(config) {
	'use strict';

	mongoose.connect(config.db);
	var db = mongoose.connection;

	db.once('open', function(err) {
		if(err) {
			console.log('DB not opened: ' + err)
			return;
		}
	})

	db.on('error', function() {
		console.log("DB error!");
	})

	Item.seedInitializeData(config);
}