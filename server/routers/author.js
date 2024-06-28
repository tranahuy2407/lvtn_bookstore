const express = require("express");
const authorRouter = express.Router();
const Author = require("../models/author");

authorRouter.get("/author/:id", async (req, res) => {
    try {
      const authorId = req.params.id;
      const author = await Author.findById(authorId);
      if (!author) {
        return res.status(404).json({ error: "Không tìm thấy tác giả" });
      }
      res.json({ name: author.name });
    } catch (error) {
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  authorRouter.get("/api/authors", async (req, res) => {
    try {
      const authors = await Author.find();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  //xoá tác giả
  authorRouter.delete("/api/authors/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedAuthor = await Author.findByIdAndDelete(id);
      if (!deletedAuthor) {
        return res.status(404).json({ message: "Không tìm thấy tác giả để xoá" });
      }
      res.json({ message: "Xoá tác giả thành công", deletedAuthor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // thêm tác giả
  authorRouter.post('/api/addauthors', async (req, res) => {
    const { name, description, image } = req.body;
  
    try {
      const newAuthor = new Author({ name, description, image });
      await newAuthor.save();
      res.status(201).json({ message: 'Tác giả đã được thêm thành công', newAuthor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // lấy tên tác giả theo id
  authorRouter.get('/api/authors/:id/name', async (req, res) => {
    const { id } = req.params;
  
    try {
        const author = await Author.findById(id);
        if (!author) {
            return res.status(404).json({ message: 'Không tìm thấy tác giả' });
        }
        res.json({ name: author.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update tác giả
authorRouter.put('/api/authors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  try {
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    // Update thông tin tác giả
    author.name = name;
    author.description = description;
    author.image = image;

    const updatedAuthor = await author.save();
    res.json({ message: 'Thông tin tác giả đã được cập nhật', author: updatedAuthor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
//lấy tác giả theo id
authorRouter.get('/api/authors/:id', async (req, res) => {
  const { id } = req.params; // Lấy id từ request params

  try {
    const author = await Author.findById(id); 

    if (!author) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    
    res.json(author);
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  
  
module.exports = authorRouter;