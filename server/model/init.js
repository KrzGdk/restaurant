var mongoose = require('mongoose');

var Dish = mongoose.model('Dish', require('./Dish.js').schema);
var Reservation = mongoose.model('Reservation', require('./Reservation.js').schema);

module.exports = {
    Dish: Dish,
    Reservation: Reservation
};