const express = require("express");
const publisherRouter = express.Router();
const Publisher = require("../models/publisher");

//Lấy nhà xuất bản theo id
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
//Lấy tát cả nhà xuất bản
  publisherRouter.get("/api/publishers", async (req, res) => {
    try {
      const publishers = await Publisher.find();
      res.json(publishers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET all publishers
publisherRouter.get("/api/publisher", async (req, res) => {
  try {
    const publishers = await Publisher.find();
    res.json(publishers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Add publisher
publisherRouter.post("/api/add_publisher", async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: "Name và description là bắt buộc" });
      }
  
      const newPublisher = new Publisher({
        name,
        description,
      });
  
      const savedPublisher = await newPublisher.save();
      res.status(201).json(savedPublisher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

//Delete publisher theo id
publisherRouter.delete("/api/publisher/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPublisher = await Publisher.findByIdAndDelete(id);
      if (!deletedPublisher) {
        return res.status(404).json({ error: "Nhà xuất bản không tồn tại" });
      }
      res.json({ message: "Xóa nhà xuất bản thành công" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
//Update publisher theo id
publisherRouter.put("/api/publisher/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Kiểm tra nếu không có name hoặc description
        if (!name || !description) {
            return res.status(400).json({ error: "Name và description là bắt buộc" });
        }

        // Tìm và cập nhật nhà xuất bản
        const updatedPublisher = await Publisher.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        // Kiểm tra nếu không tìm thấy nhà xuất bản
        if (!updatedPublisher) {
            return res.status(404).json({ error: "Nhà xuất bản không tồn tại" });
        }

        res.json(updatedPublisher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//tìm id của nhà sản xuất
publisherRouter.get("/api/publisher/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return res.status(404).json({ error: "Nhà xuất bản không tồn tại" });
    }
    res.json(publisher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// lấy tên tác giả theo id
publisherRouter.get("/api/publishers/:publisherId/name", async (req, res) => {
  const { publisherId } = req.params;

  try {
    const publisher = await Publisher.findById(publisherId);

    if (!publisher) {
      return res.status(404).json({ error: "Publisher not found" });
    }

    // Return only the name
res.json({ name: publisher.name });
  } catch (error) {
    console.error("Error fetching publisher by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//tính số lượng nxb
publisherRouter.get('/api/publisher/count', async (req, res) => {
  try {
    const count = await Publisher.countDocuments({});
    res.json({ count });
  } catch (error) {
    console.error('Error fetching publisher count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
module.exports = publisherRouter;