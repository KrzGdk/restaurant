angular.module('appFilters', [])
    .filter('categoryFilter', function ($filter) {
        return function (items, categoryName) {
            if (categoryName.category == "Wszystkie kategorie") return items;
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
            return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
        };
    })
    .filter('polishDateTime', function () {
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
            return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + ","
                + date.getHours() + ":" + date.getMinutes();
        };
    });