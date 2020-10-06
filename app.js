// NPM required packages
const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');


// Required models
const Post = require('./models/postSchema');
const Comment = require('./models/commentSchema');
const User = require('./models/userSchema');

// Required Router
const postsRoutes = require('./routes/posts')

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
app.use(session({
  secret: 'keyboard cat',
  resave:false,
  saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
  res.locals.user = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use(postsRoutes);

// Passport configs
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// // #######################Posts Routes################################
app.get('/posts', isLoggedIn, async(req, res) =>{
    try{
      const data = await Post.find({});
      res.render("index", {data: data})
    }catch(err){
      console.log(err)  
    }
})

app.get('/posts/new', isLoggedIn, (req, res) =>{
    res.render('new')
})

app.post('/posts', async (req, res) =>{
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

app.get('/posts/:id', isLoggedIn, async(req, res) =>{
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

app.post('/posts/:id/comments', isLoggedIn, async(req, res) =>{
  try{
    const Camp = await Post.findById(req.params.id);
    const Comm = await Comment.create(
      {
        author: req.user.username,
        comment:req.body.comment
      }
    );
    await Camp.comments.push(Comm);
    await Camp.save();
    res.redirect(`/posts/${req.params.id}`) //Ajax necessary for not refreshing the page after creating the comment?
  }catch(err){
    console.log(err)
  }
})

// ##########################AUTHENTICATION ROUTES##############################
app.get('/register', (req, res) =>{
  res.render('register')
})

app.post('/register', async(req, res)=>{
  try{
    // Not saving name and email in the database, need further investigation on this behaviour using passport-mongoose
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = await User.register({name:name, username:username, email:email}, password);
    req.login(newUser, (err)=>{
      if(err){
        console.log(err);
      }else{
        req.flash('success', `Bem vindo ${newUser.username}`)
        res.redirect('/posts')
      }
    })
  }
  catch(err){
    console.log(err)
    req.flash('error', err.message);
    res.redirect('/register')
  }
})

app.get('/login', (req, res) =>{
  res.render('login')
})

app.post('/login', passport.authenticate('local', 
{
  successRedirect:'/posts',
  failureRedirect:'/login',
  failureFlash:true,
  successFlash: `Bem vindo de volta`
}))

app.get('/logout', (req, res) =>{
  req.logout();
  req.flash('success', 'Logged you out')
  res.redirect('/login');
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login')
}

// ###############Listening Port##############################
app.listen(3000, () =>{
    console.log("SERVER IS RUNNING")
})
