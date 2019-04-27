const express     = require("express");
const router      = express.Router();
const Post        = require('../models/post-model');
const Comment     = require('../models/comment-model');

router.post("/:id/new", (req, res, next)=>{
  req.body.user = req.user.username;
  req.body.post = req.params.id;
  Comment.create(req.body)
  .then((comment)=>{
    Post.findByIdAndUpdate(req.params.id, {$push: {comments: comment._id}})
    .then(()=>{
      res.redirect("/post/all");
    })
    .catch((err)=>{
      next(err);
    });
  })
  .catch((err)=>{
    next(err);
  })
})

router.post('/parks', (req, res, next) => {
  const { body } = req;

  if(!body.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if(!body.imagePark) {
    return res.status(422).json({
      errors: {
        imagePark: 'is required',
      },
    });
  }

  if(!body.description) {
    return res.status(422).json({
      errors: {
        description: 'is required',
      },
    });
  }
  const newPark = new Parks(body);
  return newPark.save()
  .then(() => res.json({ park: newPark.toJSON() }))
  .catch(next);
});

router.get("/:id/edit", (req, res, next)=>{
  Comment.findById(req.params.id)
  .then((comment)=>{
    if(req.user.username === comment.user) {
      res.render("comments/editComment", {comment});
    } else {
      req.flash("error", "You can only edit you own comments.");
      res.redirect("/");
    }
  })
  .catch((err)=>{
    next(err);
  })
})

router.post("/:id/edit", (req, res, next)=>{
  Comment.findByIdAndUpdate(req.params.id, req.body)
  .then(()=>{
    res.redirect("/post/all")
  })
  .catch((err)=>{
    next(err)
  })
})

router.post("/:id/delete", (req, res, next)=>{
  if(!req.user) {
    req.flash("error", "You need to be logged in to delete a post.");
    res.redirect("/user/login");
    return
  }
  Comment.findById(req.params.id)
  .then((comment)=>{
    if(!req.user.username === comment.user) {
      req.flash("error", "You can only delete you own comments.");
      res.redirect("/post/all");
      return
      }
      Post.findByIdAndUpdate(comment.post, {$pull: {comments: comment._id}})
      .then(()=>{
        Comment.findByIdAndDelete(req.params.id)
        .then(()=>{
        res.redirect("/post/all");
        })
        .catch((err)=>{
        next(err)
        })
      })
      .catch((err)=>{
        next(err)
      })
    })
    .catch((err)=>{
      next(err)
    })
  .catch((err)=>{
    next(err)
  })
})

router.get("/:id/all", (req, res, next)=>{
  Post.findById(req.params.id).populate("comments")
  .then((post)=>{
    if(req.user) {
    post.comments.forEach((comment) => {
        if(comment.user === req.user.username){
          comment.currentUser = true;
        }
      });
    } 
    res.render("comments/comments", {post})
  })
  .catch((err)=>{
    next(err)
  })
})

router.post("/:id/like", (req, res, next)=>{
  if(!req.user) {
    return
  }
  Comment.findById(req.params.id)
  .then((comment)=>{
    if(comment.likes.indexOf(req.user._id) !== -1){
      let likeIndex = comment.likes.indexOf(req.user._id);
      comment.likes.splice(likeIndex, 1)
    } else {
      comment.likes.push(req.user._id)
    }
    comment.save()
    .then((updatedComment)=>{
      res.json(updatedComment)
    })
    .catch((err)=>{
      res.json(err)
    })
  })
  .catch((err)=>{
    next(err)
  })
})




module.exports = router;