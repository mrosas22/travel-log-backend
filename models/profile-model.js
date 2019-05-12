const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    skills:{
        type: [String],
        required: true
    },
    bio:{
        type: String
    },
    avatar : { type: String, default: 'https://res.cloudinary.com/mrosas22/image/upload/v1552686931/gallery/avatar.png'},
    date:{
        type:  Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('Profile',ProfileSchema)