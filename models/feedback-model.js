const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const feedbackSchema = new Schema({
  user      : { type: Schema.Types.ObjectId, ref: 'User' },
  comment   : { type: String,  maxlength: 200 }
})
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;