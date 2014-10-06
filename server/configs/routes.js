var controllers = require('../controllers');

module.exports = function(app, config) {
	'use strict';
	
	app.get('/api/items', controllers.itemsCtrl.getAll);
	app.post('/api/cart', controllers.cartCtrl.update);
	app.post('/api/order', controllers.ordersCtrl.add);

	app.get("/partials/:partialArea/:partialName", function(req, res) {
		res.render("../../public/app/" + req.params.partialArea + "/" + req.params.partialName);
	});
	app.get('/tpl/:tplArea/:tplName', function(req, res) {
        res.sendFile(req.params.tplName, {'root': 'public/app/' + req.params.tplArea});
    });	

	app.get("*", function(req, res) {		 		
		res.render("index", {"cart": req.session.cart});
	});
}