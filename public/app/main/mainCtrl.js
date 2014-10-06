(function(){
	angular.module('Store').controller('mainCtrl', ["cachedItems", "$scope", mainCtrl])

	function mainCtrl(cachedItems, $scope) {
		this.items = cachedItems.query();
	};	
}());