(function() {
    angular.module('Store').factory('cart', Cart);

    function Cart($window) {
        var cart = [];
        if ($window.bootstrappedCartObject) {
            angular.extend(cart, $window.bootstrappedCartObject);
        }

        function emptyCart() {
            cart = [];
            if ($window.bootstrappedCartObject) {
                $window.bootstrappedCartObject = cart;
            }
        }

        return {
            getCart: function() {
                return cart;
            },
            emptyCart: emptyCart
        }
    }
})();