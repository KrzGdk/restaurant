
var models = require('../model/init');

var prepareDateWithTime = function (time) {
    var date = new Date(0);
    date.setHours(time.split(":")[0]);
    date.setMinutes(time.split(":")[1]);
    return date;
};

var prepareDateQuery = function (dateString) {
    var dateFrom = new Date(dateString.split("-")[2], dateString.split("-")[1], dateString.split("-")[0]);
    var dateTo = new Date(dateString.split("-")[2], dateString.split("-")[1], dateString.split("-")[0] + 1);
    return {$gte: dateFrom, $lt: dateTo};
};

var findReservations = function (queryParams, callback) {
    var beginTime = prepareDateWithTime(queryParams.beginTime);
    var endTime = prepareDateWithTime(queryParams.endTime);
    models.Reservation.find({
        $and: [
            {date: prepareDateQuery(queryParams.date)},
            {endTime: {$gte: beginTime}},
            {beginTime: {$lte: endTime}}
        ]
    }).exec(callback);
};

module.exports = {
    findReservations: findReservations,
    addReservation: null
};