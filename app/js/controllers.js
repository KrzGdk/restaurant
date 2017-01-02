var appControllers = angular.module('appControllers', []);

appControllers.controller('MainCtrl',
    function ($scope, $routeParams, $http, $filter, Menu, $uibModal, $uibTooltip, Reservations, Categories) {
        $scope.menu = Menu.query([], function () {
            $scope.pageChanged();
            $scope.pageChangedReserving();
        });

        Categories.getCategories().then(function (result) {
            $scope.selectableCategories = result.data.map(function (c) {
                return c.name;
            });
            $scope.selectableCategories.splice(0, 0, "Wszystkie kategorie");
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
        $scope.selectedCategory = {category: "Wszystkie kategorie"};

        $scope.pageChangedReserving = function paginate() {
            var begin = (($scope.reservingCurrentPage - 1) * $scope.reservingItemsPerPage), end = begin + $scope.reservingItemsPerPage;
            $scope.totalItems = $filter("categoryFilter")($scope.menu, $scope.selectedCategory).length;
            $scope.filteredReservingMenu = $filter("categoryFilter")($scope.menu, $scope.selectedCategory).slice(begin, end);
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
        $scope.reservationFinished = false;
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
            $scope.takenTables = {};
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

        $scope.getDishName = function (dishId) {
            return $scope.menu.filter(function (d) {
                return d._id == dishId;
            })[0].name;
        };

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
                $scope.reservationFinished = true;
                $scope.loadTables();
            });
        };

        $scope.beginNewReservation = function () {
            $scope.reservationDate = new Date();
            $scope.reservationBeginTime = "";
            $scope.reservationEndTime = "";
            $scope.reservedTables = [];
            resetMarkedTables();
            $scope.reservedDishes = {};
            $scope.reservationEmail = "";
            $scope.reservationPhone = "";
            $scope.reservationFinished = false;
            $scope.loadTables();
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
                    var index = $scope.reservedTables.indexOf(i);
                    $scope.reservedTables.splice(index, 1);
                    t.removeClass('table-svg-selected');
                }
            }
        };

        var resetMarkedTables = function () {
            for (var i = 1; i <= 10; i++) {
                $('#table' + i).removeClass('table-svg-selected');
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
    .controller('DishModalCtrl', function ($scope, $uibModalInstance, dish, Details, Comments, $filter) {

        var socket = io.connect('http://localhost:3000');
        socket.on('comment.new', function (data) {
            if (data.dishId == dish._id) {
                $scope.$apply(function() {
                    $scope.comments.push(data);
                    $scope.pageChanged();
                    calculateRating();
                });
            }
        });

        $scope.dish = dish;
        $scope.details = {};
        $scope.commentName = "";
        $scope.commentText = "";
        $scope.comments = [];
        Details.getDetails(dish._id).then(function (result) {
            $scope.details = result.data;
        });

        $scope.itemsPerPage = 6;
        $scope.paginatedComments = [];
        $scope.currentPage = 1;
        $scope.totalItems = 0;

        $scope.pageChanged = function paginate() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage), end = begin + $scope.itemsPerPage;

            $scope.totalItems = $scope.comments.length;
            $scope.paginatedComments = $filter("orderBy")($scope.comments, "timestamp", true).slice(begin, end);
        };

        function calculateRating() {
            $scope.rating = Math.round($scope.comments.map(function (c) {
                        return c.rating;
                    }).reduce(function (p, c) {
                        return p + c;
                    }, 0) / $scope.comments.length) || 3;
        }

        var loadComments = function () {
            Comments.getComments(dish._id).then(function (result) {
                $scope.comments = result.data;
                for(var i = 0; i < $scope.comments.length; i++) {
                    $scope.comments[i].timestamp = new Date($scope.comments[i].timestamp);
                }
                calculateRating(result);
                $scope.pageChanged();
            });
        };


        loadComments();

        $scope.addComment = function () {
            Comments.addComment({
                dishId: dish._id,
                name: $scope.commentName,
                text: $scope.commentText,
                rating: $('#dish-rating').val()
            }).then(function () {
                loadComments();
                $scope.commentName = "";
                $scope.commentText = "";
            });
        };


        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        $scope.ok = function () {
            $uibModalInstance.close();
        };

    });