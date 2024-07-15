const mongoose = require("mongoose");

let Invoice;
try {
    Invoice = mongoose.model("Invoice");
} catch (error) {
    const invoicesSchema = new mongoose.Schema({
        invoiceCode: {
            type: String, 
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: Number,
            default: 0,
        },
        note:{
            type: String, 
            default: "",
        },
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order'
        },
    });

    // Middleware to auto-generate the invoice code
    invoicesSchema.pre('save', async function(next) {
    if (this.isNew) {
      try {
        const lastInvoice = await mongoose.model('Invoice').findOne().sort({ _id: -1 });
        let newCode = 'INV-0001'; 
  
        if (lastInvoice && lastInvoice.invoiceCode) {
          const lastCode = lastInvoice.invoiceCode;
          const lastNumber = parseInt(lastCode.substring(4), 10);
          newCode = `INV-${String(lastNumber + 1).padStart(4, '0')}`; 
        }
  
        this.invoiceCode = newCode;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

    Invoice = mongoose.model("Invoice", invoicesSchema);
}


module.exports = Invoice;
