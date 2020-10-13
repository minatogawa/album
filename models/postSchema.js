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

postSchema.pre('remove', async function(){
    try{
        await Comment.remove(
            {
                "_id":{
                    $in:this.comments
                }
            }
        )
    }catch(err){
        console.log(err)
    }
})

module.exports  = mongoose.model('Post', postSchema);

