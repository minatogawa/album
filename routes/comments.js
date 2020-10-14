const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');

// ##########################COMMENTS ROUTES##############################

router.post('/posts/:id/comments', isLoggedIn, async(req, res) =>{
  try{
    const postData = await Post.findById(req.params.id);
    const Comm = await Comment.create(
      {
        author: req.user.username,
        comment:req.body.comment
      }
    );
    await postData.comments.push(Comm);
    await postData.save();
    req.flash('success', "Comentário Adicionado!")
    res.redirect(`/posts/${req.params.id}`) //Ajax necessary for not refreshing the page after creating the comment?
  }catch(err){
      console.log(err)
  }
})

router.delete('/posts/:id/comments/:comment_id', async(req, res) =>{
  try{
    await Post.updateOne(
      {_id: req.params.id}, 
      {$pull: 
        {'comments': req.params.comment_id}
      }
    );
    await Comment.deleteOne({_id: req.params.comment_id});
    req.flash('success', 'Comentário removido com sucesso!')
    res.redirect('back')
  } catch(err){
    console.log(err);
  } 
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login')
}
  

module.exports = router;