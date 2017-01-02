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
        var beginTimeString, endTimeString;
        if (!beginTime || !endTime) {
            beginTimeString = "11:00";
            endTimeString = "23:00"
        } else {
            beginTimeString = pad(beginTime.getHours()) + ":" + pad(beginTime.getMinutes());
            endTimeString = pad(endTime.getHours()) + ":" + pad(endTime.getMinutes());
        }
        var qp = $httpParamSerializer({
            date: pad(dayOfMonth) + "-" + pad(monthIndex) + "-" + year,
            beginTime: beginTimeString,
            endTime: endTimeString
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

appServices.service('Dish', function ($http, $httpParamSerializer) {

    this.getAll = function () {
        return $http({
            method: 'GET',
            url: "http://localhost:3000/dish-all"
        })
    };

    this.getWithDetails = function (dishId) {
        var qp = $httpParamSerializer({
            id: dishId
        });
        return $http({
            method: 'GET',
            url: "http://localhost:3000/dish-w-details?" + qp
        })
    };

    this.editWithDetails = function (dishId, dish, details, file) {
        var payload = new FormData();

        payload.append("name", dish.name);
        payload.append("active", dish.active);
        payload.append("category", dish.category);
        payload.append('description', details.description);
        payload.append("ingredients", details.ingredients);
        payload.append('file', file);

        return $http({
            url: "http://localhost:3000/dish-w-details/" + dishId,
            method: 'POST',
            data: payload,
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity
        });

    };

    this.addWithDetails = function (dish, details, file) {
        var payload = new FormData();

        payload.append("name", dish.name);
        payload.append("active", dish.active);
        payload.append("category", dish.category);
        payload.append('description', details.description);
        payload.append("ingredients", details.ingredients);
        payload.append('file', file);

        return $http({
            url: "http://localhost:3000/dish-w-details",
            method: 'POST',
            data: payload,
            headers: { 'Content-Type': undefined},
            transformRequest: angular.identity
        });
    };

    this.deactivate = function (dishId) {
        return $http({
            method: 'POST',
            url: "http://localhost:3000/dish/" + dishId + "/deactivate"
        })
    };

    this.activate = function (dishId) {
        return $http({
            method: 'POST',
            url: "http://localhost:3000/dish/" + dishId + "/activate"
        })
    };
});