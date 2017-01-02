var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    dishId: String,
    name: String,
    text: String,
    rating: { type: Number, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = {
    schema: commentSchema
};