const express = require("express");
const commentRouter = express.Router();
const { Book } = require("../models/book");
const Comment = require('../models/comment'); 

//Lấy bình luận có status là 1
commentRouter.get("/:bookId/comments", async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Book.findById(bookId).populate({
            path: 'comments',
            match: { status: 1 },
        });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.json(book.comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// tính số sao trung bình
commentRouter.get('/api/average-rating/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId).populate('comments'); 

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const ratings = book.comments.map(comment => comment.rating);
    const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
    const roundedRating = Math.round(averageRating);
    
    res.json({ averageRating: roundedRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Đánh giá sao cho một cuốn sách
commentRouter.post('/api/rate/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const { rating, userId } = req.body;

    try {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
  
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      const existingComment = book.comments.find(comment => comment.userId.equals(userId));
  
      if (existingComment) {
        existingComment.rating = rating;
      } else {
        book.comments.push({ userId, rating });
      }
  
      await book.save();
      const ratings = book.comments.map(comment => comment.rating);
      const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
      const roundedRating = Math.round(averageRating);
  
      res.json({ message: 'Rating updated', averageRating: roundedRating });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = commentRouter;