var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username : String,
    password : String
});

userSchema.methods.validPassword = function(password) {
    return password == this.password;
};

module.exports = mongoose.model('User', userSchema);