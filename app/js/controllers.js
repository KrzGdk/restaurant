var appControllers = angular.module('appControllers', []);

appControllers.controller('MainCtrl',
    function ($scope, $routeParams, $http, $filter, Menu, $uibModal, $uibTooltip, Reservations) {
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
                $scope.filteredReservingMenu.push({name: ""});
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
        $scope.floor = Math.floor;

        $scope.reservationDate = new Date();
        $scope.reservationBeginTime = null;
        $scope.reservationEndTime = null;
        $scope.reservedTables = [];
        $scope.reservedDishes = {};
        $scope.reservationEmail = "";
        $scope.reservationPhone = "";
        $scope.isLoadingTables = false;
        $scope.takenTables = {};
        $scope.loadTables = function () {
            if ($scope.reservationBeginTime != null && $scope.reservationEndTime != null &&
                $scope.reservationBeginTime < $scope.reservationEndTime) {
                $scope.isLoadingTables = true;
                Reservations.getReservations($scope.reservationDate, $scope.reservationBeginTime, $scope.reservationEndTime)
                    .then(function success(reservations) {
                        parseReservations(reservations.data);
                        $scope.isLoadingTables = false;
                    });
            }
        };
        var parseReservations = function (reservations) {
            var disabledTablesArrays = reservations.map(function (r) {
                return r.tables;
            });
            [].concat.apply([], disabledTablesArrays)
                .filter(function (e, i, arr) {
                    return arr.lastIndexOf(e) === i;
                })
                .forEach(function (tableId) {
                    for (var i = 0; i < reservations.length; i++) {
                        if (reservations[i].tables.indexOf(tableId) != -1) {
                            if (tableId in $scope.takenTables) {
                                $scope.takenTables[tableId].push({
                                    from: reservations[i].beginTime,
                                    to: reservations[i].endTime
                                });
                            }
                            else {
                                $scope.takenTables[tableId] = [{
                                    from: reservations[i].beginTime,
                                    to: reservations[i].endTime
                                }];
                            }
                        }
                    }
                });
        };

        $scope.showAvailability = function (i) {
            if ($scope.takenTables[i]) {
                document.getElementById('table-availability').innerHTML =
                    "Stolik #" + i + " zajęty w godzinach: " +
                    $scope.takenTables[i].map(function (timeRange) {
                        return formatTimeRange(new Date(timeRange.from)) + '-' + formatTimeRange(new Date(timeRange.to))
                    }).join(", ");
                $('#table-availability').css('display', 'block');
            }
        };
        $scope.clearAvailability = function () {
            document.getElementById('table-availability').innerHTML = "&#8203;";
        };

        var formatTimeRange = function (tr) {
            return pad(tr.getHours()) + ":" + pad(tr.getMinutes());
        };

        function pad(n) {
            return n < 10 ? '0' + n.toString(10) : n.toString(10);
        }

        $scope.addReservation = function () {
            Reservations.addReservation({
                date: $scope.reservationDate,
                beginTime: $scope.reservationBeginTime,
                endTime: $scope.reservationEndTime,
                tables: $scope.reservedTables,
                menu: $scope.menu.filter(function (d) {
                    return d._id in $scope.reservedDishes;
                }),
                email: $scope.reservationEmail,
                phone: $scope.reservationPhone
            }).then(function success() {
                $scope.loadTables();
            });
        };

        $scope.markTable = function (i) {
            var t = $('#table' + i);
            if (!t.hasClass('table-svg-disabled')) {
                if ($scope.reservedTables.indexOf(i) == -1) {
                    $scope.reservedTables.push(i);
                    $scope.reservedTables.sort();
                    t.addClass('table-svg-selected');
                }
                else {
                    var index = $scope.reservedTables.indexOf(i)
                    $scope.reservedTables.splice(index, 1);
                    t.removeClass('table-svg-selected');
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