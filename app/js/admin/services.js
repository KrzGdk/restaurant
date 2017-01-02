var appServices = angular.module('adminAppServices', ['ngResource']);

appServices.factory('Auth', function () {
    return { isLoggedIn : false};
});