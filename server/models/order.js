const mongoose = require("mongoose");
const { booksSchema } = require("./book");
const { defaults } = require("autoprefixer");

const orderSchema = mongoose.Schema({
  books: [
    {
      book: booksSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
    orderedAt: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gift: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
});

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

