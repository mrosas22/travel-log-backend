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
    avatar :{
      type: String
    },
    date :{
      type: Date,
      default: Date.now
    },
    bio      : {type: String, require: false},
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


