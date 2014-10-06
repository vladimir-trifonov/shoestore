(function() {
	angular.module('Store').controller('cartCtrl', ["$scope", "cart", "cachedItems", "cartService", "$rootScope", "collectionHelper", cartCtrl]);

	function cartCtrl($scope, cart, cachedItems, cartService, $rootScope, collectionHelper) {
		$scope.cart = cart.getCart();

		$scope.$on('addItem', onCartChangedEventHandler);
		$scope.$on('discardItem', onCartChangedEventHandler);
		$scope.$on('cartChanged', function() {
			$scope.cart = cart.getCart();
		});

		function onCartChangedEventHandler(e, items, callback) {
			updateCartItemsAmount(items, $scope.cart, collectionHelper);
			updateCollectionItemsAmount(items, cachedItems);
			cartService.updateCart($scope.cart);

			if (callback) {
				callback();
			}
		}
	};

	function updateCartItemsAmount(items, cart, collectionHelper) {
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				var itemToUpdate = items[id],
					cartItem = collectionHelper.getItemByTypeAndId(cart, itemToUpdate.type, id);
				if (cartItem) {
					if (cartItem.type === itemToUpdate.type) {
						cartItem.amount += itemToUpdate.amount;
						return;
					}
				}
				cart.push(items[id]);
			}
		}
	};

	function updateCollectionItemsAmount(items, cachedItems) {
		cachedItems.updateItemsAmounts(items);
	};
}());