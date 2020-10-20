const Comment = require('../models/commentSchema');
const Post = require('../models/postSchema');

module.exports = {
    isLoggedIn: (req, res, next) =>{
        if(req.isAuthenticated()){
          return next();
        }
        res.redirect('/login')
    },
    
    isPostOwner: async (req, res, next) =>{ 
        if(req.isAuthenticated()){
          const data = await Post.findById({_id:req.params.id})
          if(data.author.id.equals(req.user.id)){
            return next();
          }else{
            req.flash('error', "Você não é o autor dessa publicação")
            res.redirect('back')
          }
        }else{
          req.flash('error', "Você precisa fazer login")
          res.redirect('/login');
        }
      },

    isCommentOwner: async (req, res, next) =>{
      if(req.isAuthenticated()){
        const data = await Comment.findById({_id:req.params.comment_id})
        if(data.author.id.equals(req.user.id)){
          return next();
        }
        req.flash("error", "Você não tem autorização para essa ação")
        res.redirect('back');
      }
      req.flash("error", "Você precisa fazer login")
      res.redirect('/login')
    }
}


