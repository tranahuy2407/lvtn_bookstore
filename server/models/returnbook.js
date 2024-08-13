const mongoose = require("mongoose");

const returnbooksSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true,
  }],
  status: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,  
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  note: {
    type: String,
    default: "",
  },
});

const ReturnBook = mongoose.model("ReturnBook", returnbooksSchema);

module.exports = ReturnBook;
