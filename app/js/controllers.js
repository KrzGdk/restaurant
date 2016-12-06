var appControllers = angular.module('appControllers', []);

appControllers.controller('MainCtrl',
    function ($scope, $routeParams, $http, $filter, Menu, $uibModal) {
        $scope.menu = Menu.query([], function () {
            $scope.pageChanged();
            $scope.pageChangedReserving();
        });

        // menu pagination
        $scope.itemsPerPage = 6;
        $scope.paginatedMenu = $scope.menu.slice(0, $scope.itemsPerPage);
        $scope.currentPage = 1;
        $scope.totalItems = $scope.menu.length;

        $scope.pageChanged = function paginate() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage), end = begin + $scope.itemsPerPage;

            $scope.totalItems = $scope.menu.length;
            $scope.paginatedMenu = $scope.menu.slice(begin, end);
        };

        // reserving menu pagination
        $scope.reservingItemsPerPage = 4;
        $scope.filteredReservingMenu = $scope.menu.slice(0, $scope.reservingItemsPerPage);
        $scope.reservingCurrentPage = 1;
        $scope.totalItems = $scope.menu.length;

        $scope.pageChangedReserving = function paginate() {
            var begin = (($scope.reservingCurrentPage - 1) * $scope.reservingItemsPerPage), end = begin + $scope.reservingItemsPerPage;
            $scope.totalItems = $scope.menu.length;
            $scope.filteredReservingMenu = $scope.menu.slice(begin, end);
            var mod = $scope.filteredReservingMenu.length % $scope.reservingItemsPerPage;
            while (mod != 0) {
                $scope.filteredReservingMenu.push({name:""});
                mod = $scope.filteredReservingMenu.length % $scope.reservingItemsPerPage;
            }
        };

        // SVG
        $scope.svg = {
            tableHeight: 12,
            marginLeft: 15,
            marginTopRow: 5,
            marginBottomRow: 5
        };

        $scope.reservationDate = new Date();
        $scope.reservedTables = [];
        $scope.reservedDishes = {};

        $scope.markTable = function (i) {
            var t = $('#table' + i);
            if (!t.hasClass('tableSvg-reserved')) {
                if ($scope.reservedTables.indexOf(i) == -1) {
                    $scope.reservedTables.push(i);
                    $scope.reservedTables.sort();
                    t.addClass('tableSvg-selected');
                }
                else {
                    var index = $scope.reservedTables.indexOf(i)
                    $scope.reservedTables.splice(index, 1);
                    t.removeClass('tableSvg-selected');
                }
            }
        };


        // dish modal
        $scope.openModal = function (size, dish) {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/dishModal.html',
                controller: 'DishModalCtrl',
                size: size,
                resolve: {
                    dish: function () {
                        return dish;
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });
        };

    })
    .controller('DishModalCtrl', function ($scope, $uibModalInstance, dish) {

        $scope.dish = dish;

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });