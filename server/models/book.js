const mongoose = require("mongoose");
const commentSchema = require("./comment");
const ratingSchema = require("./rating");

const booksSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  images: {
      type: String,
      required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  promotion_percent: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  promotion_price: {
    type: Number,
    required: true,
    default: function() {
      return this.price; 
    }
  },
  categories: [{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  author: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  publishers: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher'
  },
  comments: [commentSchema],
  ratings: [ratingSchema],
});

const Book = mongoose.model("Book", booksSchema);
module.exports = { Book, booksSchema };