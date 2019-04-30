const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../models/comment-model');
const Profile = require('../models/profile-model');

const router = express.Router();

router.get('/test',(req,res) => res.json({message:'Router Works'}));

router.post('/', ensureAuthenticated, (req,res) => {

    const newPost = new Post({
        text : req.body.text,
        name : req.body.name,
        avatar : req.body.avatar,
        user : req.user.id
    })

    newPost.save().then((post) => {
       return res.json(post)
    }).catch((err) => {
        return res.status(404).json(err)
    });
});

router.get('/:id', ensureAuthenticated, (req,res) => {

    Post.findOne({_id: req.params.id})
        .then(post => {
            if(!post){
              return  res.status(404).json({post: 'No Post found with this id'});
            }

            return res.json(post);
        }).catch(err => res.status(404).json({noPostFound:'No Post Found'}))
});


router.get('/', ensureAuthenticated, (req,res) => {

    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts)).catch(err => res.status(404).json(err));
});

router.delete('/:id', ensureAuthenticated, (req,res) => {
    Profile.findOne({_id: req.user.id})
        .then(profile =>{
            Post.findOne({_id: req.params.id})
            .then(post => {
                if(post.user.toString() !== req.user.id){
                    return res.status(401).json({notauthorised: 'User not authorised'});
                }

                post.remove().then(() => res.json({success: 'true'}))
            }).catch(err => res.status(404).json(err));
        }).catch(err => res.status(404).json(err));
});


router.post('/like/:id', ensureAuthenticated, (req,res) => {
    Profile.findOne({_id: req.user.id})
        .then(profile =>{
            Post.findOne({_id: req.params.id})
            .then(post => {
                
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                    return res.status(400).json({alreadyLiked: 'Already liked the post'})
                }    
                //Add user id to post likes
                post.likes.unshift({ user : req.user.id});

                post.save().then(post => res.json(post))

            }).catch(err => res.status(404).json({err:'Post Not Found'}));
        }).catch(err => res.status(404).json(err));

});

router.post('/unlike/:id', ensureAuthenticated, (req,res) => {

    Profile.findOne({_id: req.user.id})
        .then(profile =>{
            Post.findOne({_id: req.params.id})
            .then(post => {
                
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                    return res.status(400).json({notLiked: 'You haven\'t liked this post'})
                }    
                //Find Index of
                const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

                // Remove
                post.likes.splice(removeIndex,1);

                //Save
                post.save().then(post => res.json(post));

            }).catch(err => res.status(404).json({err:'Post Not Found'}));
        }).catch(err => res.status(404).json(err));

});

router.post('/comment/:post_id', ensureAuthenticated, (req,res) =>{

    Post.findOne({_id: req.params.post_id})
        .then(post => {

            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id,
            }
            //Add to comments array
            post.comments.unshift(newComment);
            // return res.json(post);
            post.save().then(post => res.json(post)); 

        }).catch(err => res.status(404).json({postNotFound:'No Post found'}));

})

router.delete('/comment/:id/:comment_id', ensureAuthenticated, (req,res) =>{
    Post.findOne({_id: req.params.id})
        .then(post => {

            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                return res.status(404).json({commentNotFound:'Comment Not Found'});
            }
           //Find Index
           const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);

           // Remove Index
           post.comments.splice(removeIndex,1);

           //Save Post
           post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({postNotFound:'No Post found'}));

})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/api/login')
    }
}

module.exports = router;