const express = require("express");
const bookRouter = express.Router();
const { Book } = require("../models/book");
const Category = require('../models/category');
const  Author = require('../models/author'); 
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Recent = require('../models/recents');
const Order = require('../models/order'); 

// Endpoint lấy tất cả
bookRouter.get("/api/products", async (req, res) => {
  try {
    let query = {};
    if (req.query.category) {
      query.categories = { $in: req.query.category.split(",") };
    }

    const products = await Book.find(query);
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Endpoint lấy sản phẩm theo ID
bookRouter.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Book.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint tìm kiếm sách
bookRouter.get('/api/products/search/:query?', async (req, res) => {
  try {
    let query = decodeURIComponent(req.params.query?.trim());

    if (!query || query === 'undefined') {
      const books = await Book.find().populate('author');
      return res.json(books);
    }

    let authorId;

    try {
      authorId = mongoose.Types.ObjectId(query);
    } catch (error) {
     
      const author = await Author.findOne({ name: { $regex: query, $options: "i" } });
      if (author) {
        authorId = author._id;
      } else {
        console.log(`Không tìm thấy tác giả với tên: ${query}`);
      }
    }

    if (authorId) {
      const booksByAuthor = await Book.find({ author: authorId }).populate('author');
      return res.json(booksByAuthor);
    }

    // Tìm kiếm theo tên sách nếu không tìm thấy tác giả khớp
    const nameMatchBooks = await Book.find({ name: { $regex: query, $options: "i" } }).populate('author');
    return res.json(nameMatchBooks);

  } catch (e) {
    console.error("Error searching books:", e.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Lấy danh mục sản phẩm của sản phẩm thông qua id sản phẩm đó
bookRouter.get("/api/product-categories/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Book.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const categoryIds = product.categories;
    const categories = await Category.find({ _id: { $in: categoryIds } });
    const categoryNames = categories.map(category => ({ _id: category._id, name: category.name }));

    res.json(categoryNames);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Endpoint lấy danh mục từ id
bookRouter.get('/api/books-by-category/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const books = await Book.find({ categories: categoryId });
    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No books found for this category' });
    }
    res.json(books);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: error.message });
  }
});
// Endpoint lấy sách bán chạy
bookRouter.get('/api/best-sellers', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const orders = await Order.find({
      orderedAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();
    const bookSales = {};
    orders.forEach(order => {
      order.books.forEach(item => {
        const bookId = item.book._id.toString();
        if (!bookSales[bookId]) {
          bookSales[bookId] = 0;
        }
        bookSales[bookId] += item.quantity;
      });
    });
    const bookIds = Object.keys(bookSales);
    const books = await Book.find({ _id: { $in: bookIds } }).lean();
    const sortedBooks = books.map(book => ({
      ...book,
      totalSold: bookSales[book._id.toString()],
    })).sort((a, b) => b.totalSold - a.totalSold);

    res.json(sortedBooks);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Endpoint để lấy các sản phẩm liên quan
bookRouter.get("/api/related-books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId).populate('author categories');
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const categoryIds = book.categories.map(category => new mongoose.Types.ObjectId(category));
    const relatedBooks = await Book.find({
      _id: { $ne: new mongoose.Types.ObjectId(bookId) }, 
      categories: { $in: categoryIds }, 
      author: { $ne: book.author._id }
    }).populate('author categories');

    res.json(relatedBooks);
  } catch (error) {
    console.error("Error fetching related books:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Lấy sách của tác giả
bookRouter.get('/books/by-author/:authorId', async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const books = await Book.find({ author: authorId });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Đếm số lần click vào sách
bookRouter.post('/api/books/:bookId/counter', async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    let recent = await Recent.findOne({ userId });

    if (!recent) {
      recent = new Recent({
        userId,
        books: []
      });
    }
    const bookIndex = recent.books.findIndex(entry => entry._id.toString() === bookId);

    if (bookIndex !== -1) {
      recent.books[bookIndex].count += 1;
    } else {
      recent.books.push({
        _id: bookId,
        count: 1
      });
    }

    await recent.save();
    res.status(200).json({ message: 'Book click count updated successfully' });
  } catch (error) {
    console.error('Error updating book click count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Lấy sách quan tâm 
bookRouter.get('/api/books/interested', async (req, res) => {
  try {
    const { userId, currentBookId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const recent = await Recent.findOne({ userId });

    if (!recent) {
      return res.status(404).json({ message: 'No recent books found for this user' });
    }

    const sortedBooks = recent.books
      .sort((a, b) => b.count - a.count)
      .map(entry => ({ _id: entry._id, count: entry.count }));

    const filteredBooks = sortedBooks.filter(entry => entry._id.toString() !== currentBookId);

    const books = await Book.find({ '_id': { $in: filteredBooks.map(b => b._id) } })
      .populate('author categories');  

    const resultBooks = filteredBooks.map(entry => {
      const book = books.find(b => b._id.toString() === entry._id.toString());
      return book ? { ...book.toObject(), count: entry.count } : null;
    }).filter(b => b);

    res.status(200).json({ books: resultBooks });
  } catch (error) {
    console.error('Error retrieving interested books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = bookRouter;
