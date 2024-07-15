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
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  orderedAt: {
    type: Date,  
    default: Date.now,
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
  note: {
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

// Middleware để tự động tạo mã đơn hàng
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

orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      updatedAt: this.updatedAt
    }];
  }
  next();
});

// Middleware để thêm vào lịch sử trạng thái trước khi update
orderSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.status !== undefined) {
    if (!update.$push) {
      update.$push = {};
    }
    update.$push.statusHistory = { status: update.status, updatedAt: new Date() };
    update.updatedAt = new Date();
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
