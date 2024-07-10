const express = require("express");
const bookRouter = express.Router();
const auth = require("../middlewares/auth");
const { Book } = require("../models/book");
const Category = require('../models/category');
const  Author = require('../models/author'); 
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

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

    // Nếu không có query hoặc query là 'undefined', trả về tất cả các sách
    if (!query || query === 'undefined') {
      const books = await Book.find().populate('author');
      return res.json(books);
    }

    let authorId;

    // Chuyển đổi query thành ObjectID nếu là một chuỗi hợp lệ
    try {
      authorId = mongoose.Types.ObjectId(query);
    } catch (error) {
      // Nếu không phải là ObjectID hợp lệ, tìm tác giả theo tên
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
    const limit = parseInt(req.query.limit) || 10;
    let books = await Book.find();
    books = books.map(book => {
      const reduction = book.initial_stock - book.quantity;
      return { ...book._doc, reduction }; 
    });
    books.sort((a, b) => b.reduction - a.reduction);
    books = books.slice(0, limit);

    res.json(books);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Endpoint để lấy các sản phẩm liên quan
bookRouter.get("/api/related-books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const categoryIds = book.categories.map(category => new ObjectId(category.$oid || category));
    const relatedBooks = await Book.find({
      _id: { $ne: new ObjectId(bookId) }, 
      categories: { $in: categoryIds }, 
      author: { $ne: book.author }
    }).populate('author categories'); 

    res.json(relatedBooks);
  } catch (error) {
    console.error("Error fetching related books:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = bookRouter;
