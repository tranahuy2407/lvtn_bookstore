const mongoose = require("mongoose");
const { booksSchema } = require("./book");
let Recent;

try {
    Recent = mongoose.model("Recent");
} catch (error) {
  const recentsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    books: [
        {
          book: booksSchema,
          count: {
            type: Number,
            required: true,
            default: 0
          },
        },
      ],
  });

  Recent = mongoose.model("Recent", recentsSchema);
}

module.exports = Recent;
