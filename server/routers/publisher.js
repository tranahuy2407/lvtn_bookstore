const express = require("express");
const publisherRouter = express.Router();
const Publisher = require("../models/publisher");

publisherRouter.get("/publisher/:id", async (req, res) => {
    try {
      const publisherId = req.params.id;
      const publisher = await Publisher.findById(publisherId);
      if (!publisher) {
        return res.status(404).json({ error: "Không tìm thấy nhà xuất bản" });
      }
      res.json({ name: publisher.name });
    } catch (error) {
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  publisherRouter.get("/api/publishers", async (req, res) => {
    try {
      const publishers = await Publisher.find();
      res.json(publishers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = publisherRouter;