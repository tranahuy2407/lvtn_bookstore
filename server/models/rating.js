const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
});


module.exports = ratingSchema;
