const mongoose = require("mongoose");

let Category;

try {
  Category = mongoose.model("Category");
} catch (error) {
  const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default:"",
    },
    image: {
      type: String,
      required: true,
    },
    country: {
      type: [String],
      required: true,
      default: ["Sách trong nước"],
    },
    type: {
      type: String,
      required: true,
    },
  });

  Category = mongoose.model("Category", categorySchema);
}

module.exports = Category;
