var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({
    date: Date,
    beginTime: Date,
    endTime: Date,
    tables: [],
    menu: [],
    email: String,
    phone: String
});

module.exports = {
    schema: reservationSchema
};