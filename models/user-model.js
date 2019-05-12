const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // document structure & rules defined here
      fullName: {
      type: String,
      required: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^.+@.+\..+$/
    },
    encryptedPassword: { 
      type: String, 
      required: true 
    },
    profile:{
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },
    skills:{
      type: [String],
      required: true
    },
    bio:{
      type: String
    },
    title:{
      type: String
    },
    avatar : { type: String, default: 'https://res.cloudinary.com/mrosas22/image/upload/v1552686931/gallery/avatar.png'},
    date :{
      type: Date,
      default: Date.now
    },
    following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    role     : {type: String, enum: ['GUEST', 'EDITOR', 'ADMIN'], default: 'GUEST'},
  },
  {
    timestamps: true
  }
);


const User = mongoose.model("User", userSchema);

module.exports = User;


