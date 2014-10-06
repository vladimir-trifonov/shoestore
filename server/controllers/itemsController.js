var Item = require('mongoose').model('Item');

module.exports = {
	getAll: function(req, res, next) {
		Item.find({}).exec(function(err, collection) {			
			if(err) {
				console.log("Items could not be loaded:" + err);
				return;
			}

			res.send(collection);
		})
	}
}