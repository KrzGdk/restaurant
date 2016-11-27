var appServices = angular.module('appServices', ['ngResource']);
appServices.service('Cart', function () {
    var productList = [];

    var addProduct = function(newObj) {
        var prod = productList.filter(function (p) {
                return p.id == newObj.id;
            });
        if (prod.length == 0) {
            newObj.quantity = 1;
            productList.push(newObj);
        } else {
            prod[0].quantity += 1;
        }
    };

    var getProducts = function(){
        return productList;
    };

    var removeProduct = function (product) {
        var prod = productList.filter(function (p) {
            return p.id == product.id;
        });
        if (prod[0].quantity == 1) {
            productList = productList.filter(function (p) {
                return p.name != product.name
            });
        } else {
            prod[0].quantity -= 1;
        }

    };

    return {
        addProduct: addProduct,
        removeProduct: removeProduct,
        getProducts: getProducts
    };
});
appServices.factory('Products', ['$resource', function ($resource) {
    return $resource('http://localhost:2403/products', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);
appServices.factory('Orders', ['$resource', function ($resource) {
    return $resource('http://localhost:2403/orders');
}]);