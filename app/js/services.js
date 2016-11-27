var appServices = angular.module('appServices', ['ngResource']);
appServices.factory('Menu', ['$resource', function ($resource) {
    return $resource('http://localhost:3000/menu', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);