(function() {
	angular.module('common.filters').filter('keyFilter', [keyFilter]);

	function keyFilter() {
		return function(item) {
			return Object.keys(item)[0];
		}
	};
}());