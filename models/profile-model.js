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
    date:{
        type:  Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('Profile',ProfileSchema)