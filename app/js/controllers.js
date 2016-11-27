var appControllers = angular.module('appControllers', []);

appControllers
    .controller('AppCtrl', ['$scope', '$routeParams', '$http', '$filter', 'Products',
        function ($scope, $routeParams, $http, $filter, Products) {
            $scope.selectableCategories = [
                "Pieczywo",
                "Napoje",
                "Nabiał",
                "Słodycze",
                "Alkohole"
            ];
            $scope.categories = [
                "Wszystkie"
            ];
            $scope.categories.push.apply($scope.categories, $scope.selectableCategories);

        }])
    .controller('MainCtrl', ['$scope', '$routeParams', '$http', '$filter', 'Cart', 'Products',
        function ($scope, $routeParams, $http, $filter, Cart, Products) {
            $scope.selectedCategory = {category: "Wszystkie"};
            $scope.nameFilter = "";
            $scope.products = Products.query([], function() {$scope.pageChanged()});

            //pagination
            $scope.itemsPerPage = 3;
            $scope.paginatedProducts = $filter("categoryFilter")($scope.products, $scope.selectedCategory).slice(0, $scope.itemsPerPage);
            $scope.currentPage = 1;
            $scope.totalItems = $filter("categoryFilter")($scope.products, $scope.selectedCategory).length;

            $scope.pageChanged = function paginate() {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
                    , end = begin + $scope.itemsPerPage;

                var filtered = $filter("filter")($filter("categoryFilter")($scope.products, $scope.selectedCategory), $scope.nameFilter);
                $scope.totalItems = filtered.length;
                $scope.paginatedProducts = filtered.slice(begin, end);
            };
            $scope.alerts = [];
            // $scope.addProduct = function () {
            //     if (!$scope.addProductPrice || !$scope.addProductName || !$scope.addProductCategory) return;
            //     var price = $scope.addProductPrice;
            //     var priceParts = price.split('.') || [];
            //     if (priceParts.length > 2) {
            //         $scope.alerts.push({
            //             type: 'danger', msg: 'Niepoprawny format ceny.'
            //         });
            //         return;
            //     }
            //     $scope.products.push(
            //         {
            //             name: $scope.addProductName,
            //             price: $scope.addProductPrice * 100,
            //             category: $scope.addProductCategory
            //         }
            //     );
            //     $scope.pageChanged();
            // };
            //
            // $scope.closeAlert = function (index) {
            //     $scope.alerts.splice(index, 1);
            // };

            $scope.cart = Cart.getProducts();

            $scope.addToCart = function (productName) {
                var prod = $scope.products.filter(function (p) {
                    return p.name == productName
                })[0];
                // prod = JSON.parse(JSON.stringify(prod));
                Cart.addProduct(prod);
            };


        }])
    .controller('CartCtrl', ['$scope', '$routeParams', '$http', '$filter', 'Cart', 'Orders', "$location",
        function ($scope, $routeParams, $http, $filter, Cart, Orders, $location) {
            $scope.addOrderName = "";
            $scope.addOrderAddress = "";
            $scope.cart = Cart.getProducts();
            $scope.getSum = function () {
                return $scope.cart
                        .map(function (p) {
                            return p.price * p.quantity;
                        })
                        .reduce(function (p, r) {
                            return p + r
                        }, 0) / 100;
            };
            $scope.removeFromCart = function (product) {
                Cart.removeProduct(product);
                $scope.cart = Cart.getProducts();
            };

            $scope.saveOrder = function () {
                Orders.save({
                    customerName: $scope.addOrderName,
                    customerAddress: $scope.addOrderAddress,
                    products: $scope.cart
                }, function () {
                    $scope.cart = [];
                    $scope.addOrderName = "";
                    $scope.addOrderAddress = "";
                    $location.path("/main");
                }, function (response) {
                    var errors = response.data.errors;

                })
            }
        }]);
