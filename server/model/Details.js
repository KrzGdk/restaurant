var mongoose = require('mongoose');

var detailsSchema = new mongoose.Schema({
    dishId: String,
    description: String,
    ingredients: [String]
});

module.exports = {
    schema: detailsSchema
};