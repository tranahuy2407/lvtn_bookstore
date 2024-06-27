const mongoose = require("mongoose");

let Publisher;

try {
    Publisher = mongoose.model("Publisher");
} catch (error) {
  const publishersSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  });

  Publisher = mongoose.model("Publisher", publishersSchema);
}

module.exports = Publisher;
