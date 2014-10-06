(function() {
	angular.module('Store').directive('itemDirective', ['cachedItems', '$rootScope', 'notifier', itemDirective]);

	function itemDirective(cachedItems, $rootScope, notifier) {
		return {
			restrict: 'A',
			transclude: false,
			replace: true,
			templateUrl: "/tpl/items/item-tpl.html",
			scope: {
				'item': '='
			},
			controller: function($scope, $element) {
				var $select = $element.find('select');

				$scope.model = {};
				$scope.addItem = function() {
					var val = $select.val();

					var items = {};
					items[$scope.item._id] = createItem($scope.item, val);

					$rootScope.$broadcast('addItem', items, function() {
						$scope.model.inStock = checkIsInStock(cachedItems.isInStock, $scope.item._id, val, null);
						notifier.success('Item added to cart!')
					});
				}
			},
			link: function(scope, element, attrs, controller) {
				var $select = element.find('select');

				$select.on('change', function(e) {
					onItemTypesAmountsChangedHandler(scope, $select, cachedItems);
				});
				$rootScope.$on('discardItem', function() {
					onItemTypesAmountsChangedHandler(scope, $select, cachedItems);
				});

				scope.model.inStock = checkIsInStock(cachedItems.isInStock, scope.item._id, null, 0);
			}
		}
	};

	function onItemTypesAmountsChangedHandler(scope, $select, cachedItems) {
		scope.$evalAsync(function() {
			scope.model.inStock = checkIsInStock(cachedItems.isInStock, scope.item._id, $select.val(), null);
		});
	}

	function createItem(item, type) {
		var addedItem = {};
		return addedItem[item._id] = {
			"_id": item._id,
			"name": item.name,
			"type": type,
			"amount": 1,
			"price": item.price
		};
	};

	function checkIsInStock(fn, id, val, index) {
		return fn({
			"id": id,
			"val": val,
			"index": index
		});
	}
}());