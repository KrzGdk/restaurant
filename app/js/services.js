var appServices = angular.module('appServices', ['ngResource']);
appServices.factory('Menu', ['$resource', function ($resource) {
    return $resource('http://localhost:3000/dish', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);