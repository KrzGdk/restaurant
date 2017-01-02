var app = angular.module('shopAdminApp', ['ngRoute','ui.bootstrap','adminAppServices', 'appServices', 'ngCookies', 'appFilters']);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.
    when('/', { templateUrl: 'views/admin/login.html', controller: 'AuthCtrl' }).
    when('/main', { templateUrl: 'views/admin/main.html', controller: 'AuthCtrl' }).
    when('/menu', { templateUrl: 'views/admin/menu.html', controller: 'MenuCtrl' }).
    when('/dish/:dishId', { templateUrl: 'views/admin/dish.html', controller: 'DishCtrl' }).
    when('/dish', { templateUrl: 'views/admin/dish.html', controller: 'DishCtrl' }).
    when('/reservations', { templateUrl: 'views/admin/reservations.html', controller: 'ReservationsCtrl' }).
    otherwise({ redirectTo: '/' });

    $httpProvider.defaults.withCredentials = true;
}]);

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

app.run(function($rootScope, $location, Auth) {
    $rootScope.$on('$locationChangeStart', function(e, toState) {
        var isLogin = /#\/$/.test(toState);
        if(isLogin){
            return;
        }
        if(!Auth.isLoggedIn) {
            e.preventDefault();
            $location.path('/');
        }
    });
});