module.exports = {
	update: function(req, res, next) {
		var cart = req.body;
		req.session.cart = cart;
		res.send({success: true, cart: cart});
	}
}