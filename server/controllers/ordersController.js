var transactionCtrl = require('./transactionController'),
	collectionHelper = require('../common/collectionHelper'),
	Order = require('mongoose').model('Order');

module.exports = {
	add: function(req, res, next) {
		var data = req.body;
		
		var cart = data.cart,
			deliveryInfo = data.deliveryInfo.userInfo,
			itemsTransactionData = collectionHelper.groupBy(cart, function(item) {
			return [item._id];
		});

		var promise = transactionCtrl.beginTransaction(itemsTransactionData);
		promise.then(function(data) {
			Order.create({
				deliveryInfo: deliveryInfo,
			    orders: req.session.cart,
				statusId: 0
			});

			req.session.cart = { };
			res.send({
				success: true,
				result: data.result
			});
		}, function(data) {
			res.send({
				success: false,
				reason: data.reason
			});
		});
	}
}
