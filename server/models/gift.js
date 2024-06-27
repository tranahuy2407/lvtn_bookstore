const mongoose = require("mongoose");

let Gift;
try {
    Gift = mongoose.model("Gift");
} catch (error) {
    const giftSchema = new mongoose.Schema({
        gift_price: {
            type: Number, 
            required: true,
        },
        gifts: {
            type: String, 
            required: true,
            trim: true,
        },
        image: {
            type: String, 
            required: true,
        },
    });

    Gift = mongoose.model("Gift", giftSchema);
}
module.exports = Gift;
