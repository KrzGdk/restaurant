angular.module("shopAdminApp")
    .constant("authUrl", "http://localhost:2403/users/login")
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
    .controller("OrdersCtrl", function ($scope, $http, $location, authUrl, Orders) {
        $scope.orders = Orders.query([]);
        $scope.details = {};
        $scope.orders.forEach(function (o) {
            $scope.details[o.id] = false;
        });

        $scope.toggleShowDetails = function (order) {
            $scope.details[order.id] = !$scope.details[order.id];
        };

        $scope.showDetails = function (order) {
            return $scope.details[order.id];
        };

        $scope.productSum =  function(items) {
            return items
                .map(function (prod) {
                    return prod.price * prod.quantity;
                })
                .reduce(function (price1, price2) {
                return price1 + price2;
            }, 0);
        };
    })
    .controller("ProductsCtrl", function ($scope, $http, $location, authUrl, Products) {
        $scope.alerts = [];
        $scope.addProductName = "";
        $scope.addProductPrice = "";
        $scope.addProductCategory = "";
        $scope.products = Products.query([]);
        $scope.selectableCategories = [
            "Pieczywo",
            "Napoje",
            "Nabiał",
            "Słodycze",
            "Alkohole"
        ];

        $scope.edit = function (product) {
            Products.update({id: product.id}, product, function () {
                $scope.alerts.push({
                    type: 'success', msg: 'Zaktualizowano pozycję.'
                });
                $scope.products = Products.query([]);
            }, function (resp) {
                if (resp.status == 401) {
                    $location.path('/login').replace();
                }
                else if (resp.status == 400) {
                    var fieldsString = Object.keys(resp.data.errors)
                        .map(function (field) {
                            switch (field) {
                                case "name":
                                    return "Nazwa";
                                    break;
                                case "price":
                                    return "Cena";
                                    break;
                                case "category":
                                    return "Kategoria";
                                    break;
                            }
                        })
                        .join(", ");
                    $scope.alerts.push({
                        type: 'danger', msg: 'Błąd dodawania pozycji. Wypełnij prawidłowo pola: ' + fieldsString
                    });
                }
                else {
                    $scope.alerts.push({
                        type: 'danger', msg: 'Błąd dodawania pozycji.'
                    });
                }
            });
        };

        $scope.add = function () {
            Products.save({
                name: $scope.addProductName,
                price: $scope.addProductPrice,
                category: $scope.addProductCategory,
            }, function () {
                $scope.alerts.push({
                    type: 'success', msg: 'Dodano pozycję.'
                });
                $scope.products = Products.query([]);
                $scope.addProductName = "";
                $scope.addProductPrice = "";
                $scope.addProductCategory = "";
            }, function (resp) {
                if (resp.status == 401) {
                    $location.path('/login').replace();
                }
                else if (resp.status == 400) {
                    var fieldsString = Object.keys(resp.data.errors)
                        .map(function (field) {
                            switch (field) {
                                case "name":
                                    return "Nazwa";
                                    break;
                                case "price":
                                    return "Cena";
                                    break;
                                case "category":
                                    return "Kategoria";
                                    break;
                            }
                        })
                        .join(", ");
                    $scope.alerts.push({
                        type: 'danger', msg: 'Błąd dodawania pozycji. Wypełnij prawidłowo pola: ' + fieldsString
                    });
                }
                else {
                    $scope.alerts.push({
                        type: 'danger', msg: 'Błąd dodawania pozycji.'
                    });
                }
            });
        };

        $scope.delete = function (product) {
            Products.delete({id: product.id}, function () {
                $scope.alerts.push({
                    type: 'success', msg: 'Usunięto pozycję.'
                });
                $scope.products = Products.query([]);
            }, function (resp) {
                if (resp.status == 401) {
                    $location.path('/login').replace();
                }
                $scope.alerts.push({
                    type: 'danger', msg: 'Błąd usuwania pozycji.'
                });
            });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });