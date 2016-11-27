var shopApp = angular.module('shopAdminApp', ['ngRoute','ui.bootstrap','adminAppServices', 'ngCookies']);

shopApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.
    when('/', { templateUrl: 'views/admin/login.html', controller: 'AuthCtrl' }).
    when('/main', { templateUrl: 'views/admin/main.html', controller: 'AuthCtrl' }).
    when('/products', { templateUrl: 'views/admin/products.html', controller: 'ProductsCtrl' }).
    when('/orders', { templateUrl: 'views/admin/orders.html', controller: 'OrdersCtrl' }).
    otherwise({ redirectTo: '/' });

    $httpProvider.defaults.withCredentials = true;
}]);

shopApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
