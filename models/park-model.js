const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parkSchema = new Schema({
    name        : { type: String },
    description : { type: String },
    imagePark   : { type: String },
    reviews     : [{ type: Schema.Types.ObjectId, ref: "Feedback" }]
    
}, {
    timestamps: true
});

const Park = mongoose.model("Park", parkSchema);

module.exports = Park;