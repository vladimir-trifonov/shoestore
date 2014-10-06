var mongoose = require('mongoose');

var orderInfoSchema = mongoose.Schema({
	name: String,
	type: String,
	_id: String,
	price: Number,
	amount: Number });

var orderSchema = mongoose.Schema({
    deliveryInfo: String,
    orders: [OrderInfo],
	statusId: Number
});

var OrderInfo = mongoose.model('OrderInfo', orderInfoSchema);
var Order = mongoose.model('Order', orderSchema);
