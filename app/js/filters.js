angular.module('appFilters', [])
    .filter('categoryFilter', function ($filter) {
        return function (items, categoryName) {
            if (categoryName.category == "Wszystkie") return items;
            else return $filter("filter")(items, categoryName);
        };
    })
    .filter('polishDate', function () {
        return function (date) {
            var monthNames = [
                'stycznia',
                'lutego',
                'marca',
                'kwietnia',
                'maja',
                'czerwca',
                'lipca',
                'sierpnia',
                'września',
                'października',
                'listopada',
                'grudnia'
            ];
            return date.getDate() + " " + monthNames[date.getMonth() - 1] + " " + date.getFullYear();
        };
    });