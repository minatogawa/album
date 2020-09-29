const mongoose = require('mongoose');
const passportLocalMongoose = require ('passport-local-mongoose')

// Schema
const userSchema = new mongoose.Schema({
    fullname:String,
    email:String,
    username:String,
    password:String,
})


// Passport plugin
userSchema.plugin(passportLocalMongoose);

// Model
const User = mongoose.model('User', userSchema);

// Module exports
module.exports = User;