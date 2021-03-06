const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');
const middlewares = require('../middlewares/index');

// ##########################COMMENTS ROUTES##############################

// Creating comment rout
router.post('/posts/:id/comments', middlewares.isLoggedIn, async(req, res) =>{
  try{
    const postData = await Post.findById(req.params.id);
    const Comm = await Comment.create(
      {
        author: {
          id: req.user.id,
          username: req.user.username,
        },
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

// Edit comment Route
router.get('/posts/:id/comments/:comment_id/edit', middlewares.isCommentOwner, async(req, res) =>{
  try{
    const data = await Comment.findById({_id: req.params.comment_id});
    res.render("comments/edit", {data:data, post_id:req.params.id})
  }catch(err){
    console.log(err)
  }
})

// Update comment Route
router.put('/posts/:id/comments/:comment_id', middlewares.isCommentOwner, async(req, res) =>{
  try{
    await Comment.updateOne({_id: req.params.comment_id}, {comment: req.body.comment} )
    req.flash('success', 'Comentário editado com sucesso!')
    res.redirect(`/posts/${req.params.id}`)
  }catch(err){
    console.log(err)
  }
})


// Delete comment Route
router.delete('/posts/:id/comments/:comment_id', middlewares.isCommentOwner, async(req, res) =>{
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

module.exports = router;