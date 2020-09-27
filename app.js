// NPM required packages
const express = require('express');
const app = express();
const bodyParser = require ('body-parser')

// Required models
const Post = require('./models/postSchema');
const Comment = require('./models/commentSchema');

// Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/album', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MONGOOSE CONNECTED')
});

// Sets and middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/posts', async(req, res) =>{
    try{
      const data = await Post.find({});
      res.render("index", {data: data})
    }catch(err){
      console.log(err)  
    }
})

app.get('/posts/new', (req, res) =>{
    res.render('new')
})

app.post('/posts', async (req, res) =>{
  try{
    await Post.create({
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
    })
    res.redirect("/posts")
  }catch(err){
    console.log(err);
  }
})

app.get('/posts/:id', async(req, res) =>{
  try{
    const data = await Post.findById(req.params.id).populate('comments').exec();
    res.render('show', {data:data})
  }catch(err){
    console.log(err)
  }
})

// ##########################COMMENTS ROUTES##############################
// app.get('/posts/:id/comments/new', (req, res)=>{
//   const id = req.params.id;
//   res.render('Comments/new', {id: id})
// })

app.post('/posts/:id/comments', async(req, res) =>{
  try{
    const Camp = await Post.findById(req.params.id);
    const Comm = await Comment.create({comment:req.body.comment});
    await Camp.comments.push(Comm);
    await Camp.save();
    res.redirect(`/posts/${req.params.id}`) //Ajax necessary for not refreshing the page after creating the comment  
  }catch(err){
    console.log(err)
  }
})


app.listen(3000, () =>{
    console.log("SERVER IS RUNNING")
})
