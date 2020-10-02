const mongoose = require('mongoose');
const Comment = require('./commentSchema');
const User = require('./userSchema');

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports  = mongoose.model('Post', postSchema);

