const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const Comment = require('../models/commentSchema');

router.get('/', (req, res) =>{
  res.send("hello world")
})

// // #######################Posts Routes################################

router.get('/posts', isLoggedIn, async(req, res) =>{
    try{
      const data = await Post.find({});
      res.render("posts/index", {data: data})
    }catch(err){
      console.log(err)  
    }
})

router.get('/posts/new', isLoggedIn, (req, res) =>{
    res.render('posts/new')
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
    req.flash('success', "Seu post foi criado com sucesso!")
    res.redirect("/posts")
  }catch(err){
    console.log(err);
  }
})

router.get('/posts/:id', isLoggedIn, async(req, res) =>{
  try{
    const data = await Post.findById(req.params.id).populate('comments').exec();
    res.render('posts/show', {data:data})
  }catch(err){
    console.log(err)
  }
})

router.get('/posts/:id/edit', isLoggedIn, isPostOwner, async (req, res) =>{
  try{
    const data = await Post.findById({_id:req.params.id})
    console.log(data)
    res.render("posts/edit", {data:data})
  }catch(err){
    console.log(err)
  }
})

router.put('/posts/:id', async(req, res) =>{
  try{
    const data = await Post.findByIdAndUpdate(req.params.id, {
      title:req.body.title,
      image:req.body.image,
      description:req.body.description,
    })
    res.redirect(`/posts/${req.params.id}`)
  }catch(err){
    console.log(err)
  }
})

router.delete('/posts/:id', async (req, res) =>{
  try{
    const data = await Post.findById({_id:req.params.id});
    await data.remove()
    req.flash('success', 'Seu post foi deletado com sucesso')
    res.redirect('/posts')
  } catch(err){
    console.log(err)
  }
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', "Você precisa fazer login")
  res.redirect('/login')
}

async function isPostOwner(req, res, next){ //Necessário refatorar por questão do objectID
  if(req.isAuthenticated()){
    const data = await Post.findById({_id:req.params.id})
    console.log(data.author);
    console.log(req.user.username);
    if(data.author.equals(req.user.username)){
      console.log('FUNCIONANDO');
      return next();
    }else{
      res.redirect('back')
    }
  }else{
    req.flash('error', "Você não é o autor dessa publicação")
    res.redirect('/login');
  }
}

module.exports = router;