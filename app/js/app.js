var shopApp = angular.module('restaurantApp', ['ngRoute', 'appControllers', 'appFilters', 'appDirectives','ui.bootstrap',
    'appServices']);

shopApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/', { controller: 'MainCtrl' }).
    otherwise({ redirectTo: '/' });
}]);