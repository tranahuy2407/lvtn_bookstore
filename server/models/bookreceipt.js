const mongoose = require("mongoose");
const { booksSchema } = require("./book");

const bookreceiptsSchema = mongoose.Schema({
  books: [
    {
      book: booksSchema,
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  supplier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true
  },
  createAt: {
    type: Date,  
    default: Date.now,
  },
});


const BookReceipt = mongoose.model("BookReceipt", bookreceiptsSchema);
module.exports = BookReceipt;
