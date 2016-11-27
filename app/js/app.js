var shopApp = angular.module('shopApp', ['ngRoute', 'appControllers', 'appFilters', 'appDirectives','ui.bootstrap',
    'appServices']);

shopApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/', { templateUrl: 'views/main.html', controller: 'MainCtrl' }).
    when('/cart', { templateUrl: 'views/cart.html', controller: 'CartCtrl' }).
    otherwise({ redirectTo: '/' });
}]);