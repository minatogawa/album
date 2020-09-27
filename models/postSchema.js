const mongoose = require('mongoose');
const Comment = require('./commentSchema');

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports  = mongoose.model('Post', postSchema);

