const mongoose = require('mongoose');

const { Schema } = mongoose;

const parkSchema = new Schema({
    name        : { type: String },
    description : { type: String },
    imagePark   : { type: String }
    
}, { timestamps: true });


parkSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    imagePark: this.imagePark,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

mongoose.model('Parks', parkSchema);