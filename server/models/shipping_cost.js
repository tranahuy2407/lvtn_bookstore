const mongoose = require("mongoose");

const shipping_costSchema = new mongoose.Schema({

  province: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const ShippingCost = mongoose.model("ShippingCost", shipping_costSchema);

module.exports = ShippingCost;
