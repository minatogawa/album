const mongoose = require('mongoose');
const Comment = require('./commentSchema');
const User = require('./userSchema');

const postSchema = new mongoose.Schema({
    title: String,
    image: [
        {
            path:String,
            filename:String,
        }
    ],
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    //Porque Salvei o Id junto em versões anteriores?
    //Resposta:Para depois poder usar o equals, que é um método do objectId do mongoose.
    author:{
        id: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
        username: String, 
    },
    date:{type: Date, default: Date.now}
    
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

