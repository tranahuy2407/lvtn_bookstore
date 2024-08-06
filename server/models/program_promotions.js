const mongoose = require("mongoose");

let Program;
try {
    Program = mongoose.model("Program");
} catch (error) {
    const programsSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        image: {
            type: String, 
            required: true
        },
        status:{
            type: Number, 
            default: 1
        },
        description: {
            type: String, 
            required: true
        },
        promotions: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Promotion'
        }],
    });

    Program = mongoose.model("Program", programsSchema);
}

module.exports =  Program;
