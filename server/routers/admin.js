const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { Book } = require('../models/book');
const Order = require("../models/order");
const BookReceipt = require('../models/bookreceipt');
const bcryptjs = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET || "fasesaddyuasqwee16asdas2"; 

// Login API
adminRouter.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Email does not exist!" });
    }
    console.log(admin)
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password!" });
    }
    const token = jwt.sign(
      { id: admin._id },
      jwtSecret,
      { expiresIn: '1h' }
    );
    admin.token = token; 
    await admin.save(); 

    res.json({ token });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ error: error.message });
  }
});
//Láy thông thôngtin 
adminRouter.get('/api/admin/profile', (req, res) => {
  // Lấy token từ header Authorization
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({error: 'Invalid token'});

      try {
        const admin = await Admin.findById(userData.id);
        if (!admin) return res.status(404).json({error: 'Admin not found'});

        const {email, name, phone, _id} = admin;
        res.json({email, name, phone, _id});
      } catch (error) {
        res.status(500).json({error: 'Server error'}); 
      }
    });
  } else {
    res.status(401).json({error: 'No token provided'}); 
  }
});

// Đăng xuất
adminRouter.post("/admin/logout", (req, res) => {
  res.cookie('token', '').json({ success: true });
});


// Add product
adminRouter.post('/admin/add-product', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete the product
adminRouter.post("/admin/delete-product", async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Book.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Update product
adminRouter.put('/admin/update-product/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const updatedProductData = req.body;
    console.log('Updated Product Data:', updatedProductData); 
    const updatedProduct = await Book.findByIdAndUpdate(id, updatedProductData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: error.message });
  }
});


adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Chart
adminRouter.get('/admin/analytics', async (req, res) => {
  try {
    const receiptsAggregation = await BookReceipt.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createAt" } },
          totalExpense: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

    const ordersAggregation = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderedAt" } },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      {
        $sort: { _id: 1 } 
      }
    ]);

    const dataMap = {};
    receiptsAggregation.forEach(({ _id, totalExpense }) => {
      dataMap[_id] = { totalExpense, totalRevenue: 0 };
    });

    ordersAggregation.forEach(({ _id, totalRevenue }) => {
      if (!dataMap[_id]) {
        dataMap[_id] = { totalExpense: 0, totalRevenue };
      } else {
        dataMap[_id].totalRevenue = totalRevenue;
      }
    });

    const result = Object.keys(dataMap).map(date => ({
      date,
      totalExpense: dataMap[date].totalExpense,
      totalRevenue: dataMap[date].totalRevenue
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = adminRouter;
