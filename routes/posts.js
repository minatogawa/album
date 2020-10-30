const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const middlewares = require('../middlewares/index');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) =>{
  res.send("hello world")
})

// // #######################Posts Routes################################

// Posts dashboard route
router.get('/posts', middlewares.isLoggedIn, async(req, res) =>{
    try{
      const data = await Post.find({});
      res.render("posts/index", {data: data})
    }catch(err){
      console.log(err)  
    }
})

// Create new post routes
router.get('/posts/new', middlewares.isLoggedIn, (req, res) =>{
    res.render('posts/new')
})

router.post('/posts', upload.array('picture'), middlewares.isLoggedIn, async (req, res) =>{
  try{
    // await Post.create({
    //   title: req.body.title,
    //   image: req.body.image,
    //   description: req.body.description,
    //   author: {
    //     id:req.user.id,
    //     username:req.user.username,
    //   }
    // })
    console.log(req.body, req.files)
    req.flash('success', "Seu post foi criado com sucesso!")
    res.redirect("/posts")
    
  }catch(err){
    console.log(err);
  }
})

// Post page route
router.get('/posts/:id', middlewares.isLoggedIn, async(req, res) =>{
  try{
    const data = await Post.findById(req.params.id).populate('comments').exec();
    res.render('posts/show', {data:data})
  }catch(err){
    console.log(err)
  }
})

//Edit and Update Routes for Posts
router.get('/posts/:id/edit', middlewares.isPostOwner, async (req, res) =>{
  try{
    const data = await Post.findById({_id:req.params.id})
    res.render("posts/edit", {data:data})
  }catch(err){
    console.log(err)
  }
})

router.put('/posts/:id', middlewares.isPostOwner, async(req, res) =>{
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

//Delete routes for Posts
router.delete('/posts/:id', middlewares.isPostOwner, async (req, res) =>{
  try{
    const data = await Post.findById({_id:req.params.id});
    await data.remove()
    req.flash('success', 'Seu post foi deletado com sucesso')
    res.redirect('/posts')
  } catch(err){
    console.log(err)
  }
})

module.exports = router;