var appServices = angular.module('appServices', ['ngResource']);
appServices.factory('Menu', ['$resource', function ($resource) {
    return $resource('http://localhost:3000/dish', {}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
}]);

appServices.service('Reservations', function ($http, $httpParamSerializer) {
    this.getReservations = function (date, beginTime, endTime) {
        function pad(num) {
            return ('0' + num).slice(-2);
        }
        var dayOfMonth = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var qp = $httpParamSerializer({
            date: pad(dayOfMonth) + "-" + pad(monthIndex) + "-" + year,
            beginTime: pad(beginTime.getHours()) + ":" + pad(beginTime.getMinutes()),
            endTime: pad(endTime.getHours()) + ":" + pad(endTime.getMinutes())
        });
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/reservations?' + qp
        });
    };

    this.addReservation = function (reservation) {
        return $http({
            method: 'POST',
            url: "http://localhost:3000/reservations",
            data: reservation
        })
    }
});

appServices.service('Details', function ($http, $httpParamSerializer) {
    this.getDetails = function (dishId) {
        var qp = $httpParamSerializer({
            d: dishId
        });
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/details?' + qp
        });
    };
});

appServices.service('Comments', function ($http, $httpParamSerializer) {
    this.getComments = function (dishId) {
        var qp = $httpParamSerializer({
            d: dishId
        });
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/comments?' + qp
        });
    };

    this.addComment = function (comment) {
        return $http({
            method: 'POST',
            url: "http://localhost:3000/comments",
            data: comment
        })
    }
});

appServices.service('Categories', function ($http) {
    this.getCategories = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:3000/categories'
        });
    };
});