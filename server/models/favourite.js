const mongoose = require("mongoose");

let Favourite;

try {
    Favourite = mongoose.model("Favourite");
} catch (error) {
  const favouritesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    bookIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', 
      required: true
  }]
  });

  Favourite = mongoose.model("Favourite", favouritesSchema);
}

module.exports = Favourite;
