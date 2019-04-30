const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../models/profile-model')

//Load User Model
const User = require('../models/user-model')

router.get('/test',(req,res) => res.json({message:'Router Works'}));


router.get('/', ensureAuthenticated, (req,res) =>{ 
    const errors = {};
    Profile.findOne({user: req.user.id})
    .populate('user',['name','avatar'])
    .then( profile => {
        if(!profile){
            errors.noProfile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }

        res.status(200).json(profile);

    })
    .catch(err =>{
        return res.status(404).json(err);
    });
});

router.get('/all',(req,res) => {

    Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noProfile = 'There are no profiles';
            return res.status(404).json(errors);
        }
        res.json(profiles)
    }).catch(err =>{
        return res.status(404).json({profile: err});
    });

});


router.get('/:user_id',(req,res) =>{

    const errors = {};
    Profile.findOne({_id: req.params.user_id})
    .then(profile =>{
        if(!profile){
            errors.noProfile = 'There is no profile by this handle'
            return res.status(404).json(errors);
        }
        return res.status(200).json(profile)
    })
    .catch(err => {
        return res.status(404).json(err);
    })
});

router.post('/', ensureAuthenticated, (req,res) =>{

    const profileFields = {}
    profileFields.user = req.user.id;
    if(req.body.bio) profileFields.bio = req.body.bio;
    // Add Skills
    if(typeof req.body.skills !== undefined)
        profileFields.skills = req.body.skills.split(',');

    Profile.findOne({user: req.user.id}).then(profile =>{
        if(profile){
        //Update
            Profile.findOneAndUpdate({
                user: req.user.id
            },{
                $set: profileFields
            },{
                new : true
            }).then(profile => res.json(profile))
        }else{
            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile))
        }
    })

});

router.delete('/', ensureAuthenticated, (req,res) =>{
   Profile.findOneAndRemove({user: req.user.id})
            .then(() => {
                User.findOneAndRemove({ _id : req.user.id}).then(() =>{
                    res.json({success:true});
                })
            })

});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/')
  }
}

module.exports = router;