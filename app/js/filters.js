angular.module('appFilters', [])
    .filter('categoryFilter', function ($filter) {
        return function (items, categoryName) {
            if (categoryName.category == "Wszystkie kategorie") return items;
            else return $filter("filter")(items, categoryName);
        };
    })
    .filter('polishDate', function () {
        return function (date) {
            var dateObj;
            if (typeof date === "string" ) {
                dateObj = new Date(date);
            } else {
                dateObj = date;
            }
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
            return dateObj.getDate() + " " + monthNames[dateObj.getMonth()] + " " + dateObj.getFullYear();
        };
    })
    .filter('polishDateTime', function () {
        return function (date) {
            var dateObj;
            if (typeof date === "string" ) {
                dateObj = new Date(date);
            } else {
                dateObj = date;
            }
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
            return dateObj.getDate() + " " + monthNames[dateObj.getMonth()] + " " + dateObj.getFullYear() + ","
                + dateObj.getHours() + ":" + dateObj.getMinutes();
        };
    });