var mongoose = require('mongoose');

var Dish = mongoose.model('Dish', require('./Dish.js').schema);
var Reservation = mongoose.model('Reservation', require('./Reservation.js').schema);
var Category = mongoose.model('Category', require('./Category.js').schema);
var Details = mongoose.model('Details', require('./Details.js').schema);
var Comment = mongoose.model('Comment', require('./Comment.js').schema);

module.exports = {
    Dish: Dish,
    Reservation: Reservation,
    Category: Category,
    Details: Details,
    Comment: Comment
};