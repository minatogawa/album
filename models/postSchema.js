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
    author:String, //Porque Colt salvou o Id junto, e porque usando objectId?
})

module.exports  = mongoose.model('Post', postSchema);

