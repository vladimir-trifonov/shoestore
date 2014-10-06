(function() {
	angular.module('common.services').factory("cachedItems", ["itemsResource", "cart", "collectionHelper", cachedItems]);

	function cachedItems(itemsResource, cart, collectionHelper) {
		var cachedItems;

		function isInStock(options) {
			query();
			var options = options || {},
				item = collectionHelper.getItemById(cachedItems, options.id);

			if (typeof options.index !== "undefined" && options.index !== null) {
				var inStockItem = item.inStock[options.index],
					key = Object.keys(inStockItem)[0];
				return inStockItem[key] > 0;
			} else if (typeof options.val !== "undefined" && options.val !== null) {
				for (var i = 0; i < item.inStock.length; i++) {
					if (item.inStock[i].hasOwnProperty(options.val)) {
						return item.inStock[i][options.val] > 0;
					}
				}
			}
		}

		function updateItemsAmounts(items) {
			query();
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					var item = items[id],
						cachedItem = collectionHelper.getItemById(cachedItems, id),
						cachedItemAmount = collectionHelper.getItemByType(cachedItem.inStock, item.type);
					cachedItemAmount[item.type] -= item.amount;
				}
			}
		}

		function query() {
			if (!cachedItems) {
				cachedItems = itemsResource.query();
				cachedItems.$promise.then(function(data) {
					updateCachedItemsAmount(cart.getCart(), data, "remove", collectionHelper);
				})
			}
			return cachedItems;
		}

		return {
			query: query,
			isInStock: isInStock,
			updateItemsAmounts: updateItemsAmounts
		}
	}

	function updateCachedItemsAmount(cart, cachedItems, type, collectionHelper) {
		cart.forEach(function(item) {
			var cachedItem = collectionHelper.getItemById(cachedItems, item._id),
				cachedItemInStock = collectionHelper.getItemByType(cachedItem.inStock, item.type);

			if (type === "remove") {
				cachedItemInStock[item.type] -= item.amount;
			} else if (type === "add") {
				cachedItemInStock[item.type] += item.amount;
			}
		})
	}
}());