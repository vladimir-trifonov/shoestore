(function() {
	var app = angular.module('Store', ['ui.router', 'ngResource', 'common.services', 'common.filters', 'common.helpers']);
	app.config(['$stateProvider', '$urlRouterProvider' , configAngular])
	app.value('toastr', toastr);	
	
	function configAngular($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/main/home");

		$stateProvider
			.state("home", {
				"url": "/main/home",
				"templateUrl": "/partials/main/home",
				"controller": "mainCtrl as vm"				
			})
			.state("cart", {
				"url": "/cart",
				"templateUrl": "/partials/cart/cart-list",
				"controller": "cartListCtrl"
			});
	};
})();