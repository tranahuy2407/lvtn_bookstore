const mongoose = require("mongoose");

let Promotion;

try {
    Promotion = mongoose.model("Promotion");
} catch (error) {
    const promotionsSchema = new mongoose.Schema({
        description: {
            type: String,
            required: true
        },
        image: {
            type: String, 
            required: true
        },
        status: {
            type: Number, 
            required: true
        },
        type: {
            type: String,
            required: true
        },
            
        code: {
            type: String,
            required: true,
            unique: true
        },
        value: {
            type: Number,
            required: true
        },
        conditional: {
            type: Number,
            required: true
        },
        usage_per_user: {
            type: [String], 
            default: []
        },
        limit: {
            type: Number,
            required: true
        },
        start_day: {
            type: Date,
            required: true
        },
        end_day: {
            type: Date,
            required: true
        }
    });

    Promotion = mongoose.model("Promotion", promotionsSchema);
}

module.exports = Promotion;
