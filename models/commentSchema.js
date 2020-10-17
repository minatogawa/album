const mongoose = require('mongoose');
const Post = require('../models/postSchema')

const commentSchema = new mongoose.Schema({
    author:String, //necessário transformar em objeto para conter objectId.
    comment: String,
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;