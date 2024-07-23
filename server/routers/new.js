const express = require("express");
const mongoose = require("mongoose");
const New = require("../models/news"); // Đảm bảo đường dẫn đến model New là chính xác
const newRouter = express.Router();

// Tạo bài viết mới
newRouter.post("/api/news", async (req, res) => {
  const { title, status, content, author, image } = req.body;

  try {
    const newNews = new New({ title, status, content, author, image });
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách tất cả các bài viết
newRouter.get("/api/news", async (req, res) => {
  try {
    const news = await New.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy một bài viết cụ thể theo ID
newRouter.get("/api/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const news = await New.findById(id);
    if (!news) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật bài viết
newRouter.put("/api/news/:id", async (req, res) => {
  const { id } = req.params;
  const { title, status, content, author, image } = req.body;

  try {
    const updatedNews = await New.findByIdAndUpdate(
      id,
      { title, status, content, author, image },
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa bài viết
newRouter.delete("/api/news/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNews = await New.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = newRouter;
