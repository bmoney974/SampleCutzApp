var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var userSchema = mongoose.Schema({
    //"username" : String,
    "email" : String,
    //"password" : String

});


//userSchema.statics.authenticate = function (username, password, callback) {
//    callback({});
//};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);