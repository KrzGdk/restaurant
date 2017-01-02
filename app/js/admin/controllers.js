angular.module("shopAdminApp")
    .constant("authUrl", "http://localhost:3000/login")
    .controller("AuthCtrl", function ($scope, $http, $location, authUrl) {

        $scope.login = function () {
            authenticate($scope.username, $scope.password);
        };

        var authenticate = function (user, pass) {
            $http.post(authUrl, {
                username: user,
                password: pass
            }, {
                withCredentials: true
            }).success(function (data) {
                $location.path("/main");
            }).error(function (error) {
                $scope.authenticationError = error;
            });
        }
    })
    .controller("ReservationsCtrl", function ($scope, $http, $location, authUrl, Reservations) {
        Reservations.getReservations(new Date()).then(function (result) {
            $scope.reservations = result.data;
        });
        $scope.reservationDate = new Date();
        $scope.reloadReservations = function () {
            Reservations.getReservations($scope.reservationDate, $scope.reservationBeginTime, $scope.reservationEndTime).then(function (result) {
                $scope.reservations = result.data;
            });
        }

    })
    .controller("DishCtrl", function ($scope, $http, $location, $routeParams, Dish, Categories) {
        Categories.getCategories().then(function (result) {
            $scope.categories = result.data.map(function (c) {
                return c.name;
            });
        });
        if ($routeParams.dishId) {
            $scope.dishId = $routeParams.dishId;
            Dish.getWithDetails($scope.dishId).then(function (res) {
                $scope.dish = res.data.dish;
                $scope.dishName = res.data.dish.name;
                $scope.details = res.data.details;
            });
        } else {
            $scope.dishName = false;
            $scope.dish = {
                name: "",
                active: true,
                category: "Dania główne"
            };
            $scope.details = {
                description: "",
                ingredients: []
            }
        }

        $scope.addIngredient = function () {
            $scope.details.ingredients.push("");
        };

        $scope.removeIngredient = function (i) {
            $scope.details.ingredients.splice(i, 1);
        };

        $scope.saveDish = function () {
            var ingredientElements = $(".dishIngredients");
            $scope.details.ingredients = ingredientElements.map(function (index, ingredientElement) {
                return ingredientElement.value;
            }).get();
            if ($scope.dishId) {
                Dish.editWithDetails($scope.dishId, $scope.dish, $scope.details, document.getElementById("exampleInputFile").files[0]).then(function () {
                    $location.path("menu");
                });
            } else {
                Dish.addWithDetails($scope.dish, $scope.details, document.getElementById("exampleInputFile").files[0]).then(function () {
                    $location.path("menu");
                });
            }

        }

    })
    .controller("MenuCtrl", function ($scope, $http, $location, authUrl, Menu, Categories, Dish) {
        $scope.alerts = [];
        Dish.getAll().then(function (result) {
            $scope.menu = result.data;
        });
        Categories.getCategories().then(function (result) {
            $scope.selectableCategories = result.data.map(function (c) {
                return c.name;
            });
            $scope.selectableCategories.splice(0, 0, "Wszystkie kategorie");
        });
        $scope.nameFilterField = "";
        $scope.selectedCategory = {category: "Wszystkie kategorie"};

        $scope.deactivate = function (dish) {
            Dish.deactivate(dish._id).then(function () {
                dish.active = false;
            })
        };
        $scope.activate = function (dish) {
            Dish.activate(dish._id).then(function () {
                dish.active = true;
            })
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });