const express = require("express");
const commentRouter = express.Router();
const { Book } = require("../models/book");
const Order = require('../models/order');
const mongoose = require("mongoose");

// tính số sao trung bình
commentRouter.get('/api/average-rating/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId).populate('ratings'); 

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const ratings = book.ratings.map(rating => rating.rating);
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
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Sách không tồn tại' });
        }

        if (!Array.isArray(book.ratings)) {
            book.ratings = [];
        }

        // Kiểm tra đơn hàng
        const userOrders = await Order.find({ 
            userId: userId, 
            'books.book._id': bookId 
        });

        if (userOrders.length === 0) {
            return res.status(403).json({ message: 'Bạn chưa mua sách này' });
        }

        // Cập nhật hoặc thêm đánh giá
        const existingRating = book.ratings.find(r => r.userId.equals(userId));

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            book.ratings.push({ userId, rating });
        }

        await book.save();

        const ratings = book.ratings.map(r => r.rating);
        const averageRating = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
        const roundedRating = Math.round(averageRating);

        res.json({ message: 'Cập nhật đánh giá thành công', averageRating: roundedRating });
    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        res.status(500).json({ message: 'Lỗi hệ thống: Không thể cập nhật đánh giá' });
    }
});

// Đếm số lượt đánh giá 
commentRouter.get('/api/book/:bookId/rating-count', async (req, res) => {
    const { bookId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'ID sách không hợp lệ' });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Sách không tồn tại' });
        }
        const userRatingsCount = new Set(book.ratings.map(r => r.userId.toString())).size;

        res.json({ userRatingsCount });
    } catch (error) {
        console.error('Lỗi hệ thống:', error);
        res.status(500).json({ message: 'Lỗi hệ thống: Không thể đếm số lượng người dùng đánh giá' });
    }
});


//BÌNH LUẬN 
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

// Thêm bình luận 
commentRouter.post('/api/:bookId/comments', async (req, res) => {
    const { bookId } = req.params;
    const { userId, content } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'ID sách không hợp lệ' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Sách không tồn tại' });
        }

        // Kiểm tra đơn hàng
        const userOrders = await Order.find({ 
            userId: userId, 
            'books.book._id': bookId 
        });

        if (userOrders.length === 0) {
            return res.status(403).json({ message: 'Người dùng chưa mua sách này' });
        }

        const newComment = {
            userId,
            comments: [content],
            status: 1,
            reply: "",
        };

        book.comments.push(newComment);
        await book.save();

        return res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi hệ thống: Không thể thêm bình luận' });
    }
});

//lấy ds bình luận
commentRouter.get('/api/books-with-comments', async (req, res) => {
    try {
      const books = await Book.find({ 'comments.0': { $exists: true } }) 
        .populate('comments.userId', 'username') 
        .populate('ratings.userId', 'username')  
        .exec();
  
      if (books.length === 0) {
        return res.status(404).json({ message: 'Không có sách nào có bình luận.' });
      }
  
      res.json(books);
    } catch (error) {
      console.error('Lỗi khi lấy sách có bình luận:', error.message);
      res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
  });
  
  // trả lời bình luận
  commentRouter.post('/api/comments/:bookId/:commentId/reply', async (req, res) => {
    const { bookId, commentId } = req.params;
    const { reply, adminId } = req.body;
  
    try {
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ message: 'Sách không tồn tại' });
      }
      const comment = book.comments.id(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Bình luận không tồn tại' });
      }
  
      comment.reply = reply;
      comment.adminId = adminId;
  
      await book.save();
  
      res.status(200).json({ message: 'Trả lời bình luận thành công', comment });
    } catch (error) {
      console.error('Lỗi khi trả lời bình luận:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi trả lời bình luận' });
    }
  });
  
module.exports = commentRouter;