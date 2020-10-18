const mongoose = require('mongoose');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');

const commentSchema = new mongoose.Schema({
    author:{
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: String,
    },
    comment: String,
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;