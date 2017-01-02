var mongoose = require('mongoose');

var dishSchema = new mongoose.Schema({
    name: String,
    thumbnail: String,
    active: Boolean,
    category: String
});

module.exports = {
    schema: dishSchema
};