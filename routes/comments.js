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
      res.redirect(`/posts/${req.params.id}`) //Ajax necessary for not refreshing the page after creating the comment?
    }catch(err){
      console.log(err)
    }
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/login')
}
  

module.exports = router;