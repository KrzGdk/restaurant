var appServices = angular.module('adminAppServices', ['ngResource']);
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
appServices.factory('Products', ['$resource', function ($resource) {
    return $resource('http://localhost:2403/products/:id', null,
        {
            'update': { method:'PUT' }
        });
}]);