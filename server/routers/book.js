const express = require("express");
const bookRouter = express.Router();
const auth = require("../middlewares/auth");
const { Book } = require("../models/book");
const Category = require('../models/category');
const  Author = require('../models/author'); 
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
    let query = req.params.query?.trim();
  
    if (!query || query === 'undefined') {
      const books = await Book.find().populate('author');
      return res.json(books);
    }

    if (ObjectId.isValid(query)) {
      const author = await Author.findById(query);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      const booksByAuthor = await Book.find({ author: author._id }).populate('author');
      return res.json(booksByAuthor);
    }
    const authors = await Author.find({ name: { $regex: query, $options: "i" } });

    if (authors.length > 0) {
      let books = [];
      for (let author of authors) {
        const authorBooks = await Book.find({ author: author._id }).populate('author');
        books.push(...authorBooks);
      }
      return res.json(books);
    }
    const nameMatchBooks = await Book.find({ name: { $regex: query, $options: "i" } }).populate('author');
    return res.json(nameMatchBooks);

  } catch (e) {
    console.error("Error searching books:", e.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//Khuyến mãi hôm nay 
bookRouter.get("/api/deal-of-day", auth, async (req, res) => {
  try {
    let products = await Book.find({});

    products = products.sort((a, b) => {
      let aSum = 0;
      let bSum = 0;

      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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

module.exports =bookRouter;
