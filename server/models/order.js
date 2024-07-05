const mongoose = require("mongoose");
const { booksSchema } = require("./book");

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
  orderCode: {
    type: String,
    required: false,
    unique: true,
  },
  statusHistory: [
    {
      status: {
        type: Number,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


orderSchema.pre('save', async function(next) {
  this.updatedAt = new Date();
  if (this.isNew) {
    try {
      const lastOrder = await mongoose.model('Order').findOne().sort({ _id: -1 });
      
      let newCode = '#DH0001'; 

      if (lastOrder && lastOrder.orderCode) {
        const lastCode = lastOrder.orderCode;
        const lastNumber = parseInt(lastCode.substring(3), 10);
        newCode = `#DH${String(lastNumber + 1).padStart(4, '0')}`; 
      }

      this.orderCode = newCode;
    } catch (error) {
      return next(error); 
    }
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
