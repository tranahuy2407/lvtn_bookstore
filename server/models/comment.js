const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 5,
  },
  comment: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 0,
  },
  reply: {
    type: String,
    default: "",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});


module.exports = commentSchema;
