(function() {
	angular.module('Store').controller('cartListCtrl', ["$scope", "cart", "$rootScope", "orderService", 'notifier', 'cartService', cartListCtrl]);

	function cartListCtrl($scope, cart, $rootScope, orderService, notifier, cartService) {
		$scope.user = {};
		$scope.cart = cart.getCart();
		$scope.order = order;

		$scope.$on('cartChanged', function() {
			$scope.cart = cart.getCart();
		});

		$scope.removeItem = function(item) {
			var items = {};
			items[item._id] = createItem(item, item.type);
			removeItem(items, $rootScope);
		};

		function order(currentCart) {
			var cartForOrder = currentCart.filter(function(item, index) {
				return item.amount > 0;
			});

			orderService.makeOrder({
				'cart': cartForOrder,
				'deliveryInfo': $scope.user
			}).then(function() {
				notifier.success('Order Sended!');

				cart.emptyCart();
				$rootScope.$broadcast('cartChanged');

			}, function(reason) {
				notifier.error(reason);
			});;
		};
	};

	function removeItem(items, $rootScope) {
		$rootScope.$broadcast('discardItem', items, function() {});
	};

	function createItem(item, type) {
		var addedItem = {};
		return addedItem[item._id] = {
			"_id": item._id,
			"type": type,
			"amount": -1
		};
	};
}());