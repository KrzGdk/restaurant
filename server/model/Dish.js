var mongoose = require('mongoose');

var dishSchema = new mongoose.Schema({
    name: String,
    thumbnail: String,
    active: Boolean
});

module.exports = {
    schema: dishSchema
};