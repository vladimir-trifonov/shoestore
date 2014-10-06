(function() {
	angular.module('Store').factory("cartService", ["$http", "$q", cartService]);

	function cartService($http, $q) {
		return {
			updateCart: function(cart) {
				var deferred = $q.defer();
				$http.post('/api/cart', cart).success(function(response) {
					if (response.success) {
						deferred.resolve(response.cart);
					} else {
						deferred.reject(response.message);
					}
				});
				return deferred.promise;
			}
		}
	}
}());