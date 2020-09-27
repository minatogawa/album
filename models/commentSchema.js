const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: String,
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;