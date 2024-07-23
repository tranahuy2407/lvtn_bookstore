const express = require("express");
const bookReceiptRouter = express.Router();
const Supplier = require("../models/supplier");

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

module.exports = bookReceiptRouter;