(function() {
	angular.module('common.helpers').factory('collectionHelper', [collectionHelper]);

	function collectionHelper() {
		function getItemById(items, id) {
			for (var i = 0; i < items.length; i++) {
				if (items[i]._id === id) {
					return items[i];
				}
			}
			return null;
		}

		function getItemByType(items, type) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].hasOwnProperty(type)) {
					return items[i];
				}
			}
			return null;
		}

		function getItemByTypeAndId(items, type, id) {
			for (var i = 0; i < items.length; i++) {
				if (items[i]._id === id && items[i].type === type) {
					return items[i];
				}
			}
			return null;
		}

		return {
			getItemById: getItemById,
			getItemByType: getItemByType,
			getItemByTypeAndId: getItemByTypeAndId
		}
	};
}());