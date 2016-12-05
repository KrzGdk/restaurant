var mongoose = require('mongoose');

var Dish = mongoose.model('Dish', require('./Dish.js').schema);

module.exports = {
    Dish: Dish
};