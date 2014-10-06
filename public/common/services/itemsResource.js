(function() {
	angular.module('common.services').factory("itemsResource", ["$resource", itemsResource]);

	function itemsResource($resource) {
		return $resource('/api/items/:id', {
			_id: '@id'
		});
	}
}());