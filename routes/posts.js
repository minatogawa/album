const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');

router.get('/', (req, res) =>{
  res.send("hello world")
})

// // #######################Posts Routes################################

router.get('/posts', isLoggedIn, async(req, res) =>{
    try{
      const data = await Post.find({});
      res.render("index", {data: data})
    }catch(err){
      console.log(err)  
    }
})

router.get('/posts/new', isLoggedIn, (req, res) =>{
    res.render('new')
})

router.post('/posts', async (req, res) =>{
  try{
    await Post.create({
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
      author: req.user.username,
    })
    console.log(req.user.username)
    res.redirect("/posts")
  }catch(err){
    console.log(err);
  }
})

router.get('/posts/:id', isLoggedIn, async(req, res) =>{
  try{
    const data = await Post.findById(req.params.id).populate('comments').exec();
    res.render('show', {data:data})
  }catch(err){
    console.log(err)
  }
})

router.get('/posts/:id/edit', (req, res) =>{
  res.send("Edit route")
})

router.delete('/posts/:id', async (req, res) =>{
  try{
    await Post.deleteOne({_id:req.params.id});
    req.flash('success', 'Seu post foi deletado')
    res.redirect('/posts')
  } catch(err){
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