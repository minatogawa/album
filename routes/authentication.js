const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const passport = require('passport');

// ##########################AUTHENTICATION ROUTES##############################
router.get('/register', (req, res) =>{
    res.render('register')
})
  
router.post('/register', async(req, res)=>{
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
  
router.get('/login', (req, res) =>{
    res.render('login')
})
  
router.post('/login', passport.authenticate('local', 
  {
    successRedirect:'/posts',
    failureRedirect:'/login',
    failureFlash:true,
    successFlash: `Bem vindo de volta`
  }
))
  
router.get('/logout', (req, res) =>{
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

module.exports = router;