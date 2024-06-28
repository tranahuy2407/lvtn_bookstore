const mongoose = require("mongoose");

let ShippingCost;
try {
  ShippingCost = mongoose.model("ShippingCost");
} catch (error) {
    const shippingcostSchema = new mongoose.Schema({
        province: {
            type: String, 
            required: true,
        },
        cost: {
            type: Number, 
            required: true,
        },
    });

    ShippingCost = mongoose.model("ShippingCost", shippingcostSchema);
}

module.exports = ShippingCost;
