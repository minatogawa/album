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
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const authenticationRoutes = require('./routes/authentication')

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
app.use(commentsRoutes);
app.use(authenticationRoutes);

// Passport configs
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ###############Listening Port##############################
app.listen(3000, () =>{
    console.log("SERVER IS RUNNING")
})
