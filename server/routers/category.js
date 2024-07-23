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

//Lấy tất tất cả type 
categoryRouter.get('/api/category-types', async (req, res) => {
  try {
    const types = await Category.distinct('type');
    res.json(types);
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


//Thêm thể loại
categoryRouter.post('/api/addcategories', async (req, res) => {
  try {
    const { name, description, image, type } = req.body;

    // Create a new category instance
    const newCategory = new Category({
      name,
      description,
      type,
      image,
    });

    // Save the category to the database
    const savedCategory = await newCategory.save();

    // Send the saved category as a response
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Xoá thể loại 
categoryRouter.delete('/api/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  try {
    // Tìm và xoá thể loại dựa trên categoryId
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Xoá thể loại thành công' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tìm thể loại theo ID

categoryRouter.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//cập nhật thông tin thể loại
categoryRouter.put('/api/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, image, type } = req.body;

  try {
    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Cập nhật thông tin thể loại
    category.name = name;
    category.description = description;
    category.type = type;
    category.image = image;
    
    // Lưu lại vào database
    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//lấy tên thể loại theo id
categoryRouter.get('/api/categories/:categoryId/name', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
res.json({ name: category.name });
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = categoryRouter;