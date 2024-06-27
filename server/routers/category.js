const express = require("express");
const categoryRouter = express.Router();
const  Category  = require("../models/category");

categoryRouter.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET categories by type
categoryRouter.get("/api/categories/:type", async (req, res) => {
  const type = req.params.type;

  try {
    const categories = await Category.find({ type: type });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET category name by id
categoryRouter.get("/api/category/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ name: category.name }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = categoryRouter;