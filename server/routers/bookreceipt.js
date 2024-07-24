const express = require("express");
const bookReceiptRouter = express.Router();
const Supplier = require("../models/supplier");
const BookReceipt = require('../models/bookreceipt');
const { Book } = require('../models/book');
const mongoose = require('mongoose');
// Get all suppliers
bookReceiptRouter.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await Supplier.find();
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  //Get by ID
  bookReceiptRouter.get('/api/suppliers/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ msg: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
  
  // Add a new supplier
bookReceiptRouter .post("/api/suppliers", async (req, res) => {
    const supplier = new Supplier({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    });
  
    try {
      const newSupplier = await supplier.save();
      res.status(201).json(newSupplier);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a supplier
bookReceiptRouter .delete("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (supplier == null) {
        return res.status(404).json({ message: "Supplier not found" });
      }
  
      await supplier.remove();
      res.json({ message: "Deleted Supplier" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a supplier
bookReceiptRouter .put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (supplier == null) {
        return res.status(404).json({ message: "Supplier not found" });
      }
  
      if (req.body.name != null) {
        supplier.name = req.body.name;
      }
      if (req.body.email != null) {
        supplier.email = req.body.email;
      }
      if (req.body.phone != null) {
        supplier.phone = req.body.phone;
      }
      if (req.body.address != null) {
        supplier.address = req.body.address;
      }
  
      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Tạo phiếu nhập hàng
bookReceiptRouter.post('/api/book-receipts', async (req, res) => {
  const { books, totalPrice, supplierId } = req.body;
  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ message: 'Invalid supplier ID' });
    }

    const bookReceipt = new BookReceipt({
      books,
      totalPrice,
      supplier: supplierId,
    });

    const newReceipt = await bookReceipt.save();

    for (const item of books) {
      const product = await Book.findById(item.book._id);
      if (product) {
        await Book.findByIdAndUpdate(item.book._id, {
          $inc: { quantity: item.quantity }
        });
      } else {
        console.warn(`Product with ID ${item.book._id} not found.`);
      }
    }

    res.status(201).json(newReceipt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//Lấy tất cả phiếu nhập
bookReceiptRouter.get('/api/book-receipts', async (req, res) => {
  try {
    const receipts = await BookReceipt.find().populate('supplier').populate('books.book');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa từ id 
bookReceiptRouter.put('/api/book-receipts/:id', async (req, res) => {
  const { id } = req.params;
  const { supplier, books = [], totalPrice } = req.body;

  try {
    const existingReceipt = await BookReceipt.findById(id).populate('books.book');

    if (!existingReceipt) {
      return res.status(404).json({ message: 'Book receipt not found' });
    }

    const originalQuantities = new Map();
    existingReceipt.books.forEach(item => {
      originalQuantities.set(item.book._id.toString(), item.quantity);
    });

    for (const item of existingReceipt.books) {
      const book = await Book.findById(item.book._id);
      if (book) {
        book.quantity -= item.quantity; 
        await book.save();
      }
    }

    existingReceipt.supplier = supplier;
    existingReceipt.books = books;
    for (const item of books) {
      const book = await Book.findById(item.book);
      if (book) {
        const originalQuantity = originalQuantities.get(item.book.toString()) || 0;
        const quantityChange = item.quantity - originalQuantity;
        book.quantity += quantityChange; 
        await book.save();
      }
    }
    const newTotalPrice = books.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    existingReceipt.totalPrice = newTotalPrice;
    await existingReceipt.save();

    res.status(200).json(existingReceipt);
  } catch (error) {
    console.error("Error updating book receipt:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all book receipts
bookReceiptRouter.get('/api/book-receipts', async (req, res) => {
  try {
    const receipts = await BookReceipt.find().populate('supplier').populate('books.book');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



//Lấy phiếu nhập theo id 
bookReceiptRouter.get('/api/book-receipts/:id', async (req, res) => {
  try {
    const receipt = await BookReceipt.findById(req.params.id).populate('supplier').populate('books.book');
    if (!receipt) {
      return res.status(404).json({ message: 'Book receipt not found' });
    }
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = bookReceiptRouter;