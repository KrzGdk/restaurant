angular.module('appFilters', [])
    .filter('categoryFilter', function ($filter) {
        return function (items, categoryName) {
            if (categoryName.category == "Wszystkie") return items;
            else return $filter("filter")(items, categoryName);
        };
    });