(function() {
	angular.module('Store').factory("orderService", ["$http", "$q", orderService]);

	function orderService($http, $q) {
		return {
			makeOrder: function(data) {
				var deferred = $q.defer();
				$http.post('/api/order', data).success(function(response) {					
					if (response.success) {
						deferred.resolve();
					} else {
						deferred.reject(response.reason);
					}
				});
				return deferred.promise;
			}
		}
	}
}());