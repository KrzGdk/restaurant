var appControllers = angular.module('appControllers', []);

appControllers.controller('MainCtrl', ['$scope', '$routeParams', '$http', '$filter', 'Menu',
        function ($scope, $routeParams, $http, $filter, Menu) {
            $scope.menu = Menu.query([], function() {$scope.pageChanged()});

            //pagination
            $scope.itemsPerPage = 6;
            $scope.paginatedMenu = $scope.menu.slice(0, $scope.itemsPerPage);
            $scope.currentPage = 1;
            $scope.totalItems = $scope.menu.length;

            $scope.pageChanged = function paginate() {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage), end = begin + $scope.itemsPerPage;

                $scope.totalItems = $scope.menu.length;
                $scope.paginatedMenu = $scope.menu.slice(begin, end);
            };

        }]);