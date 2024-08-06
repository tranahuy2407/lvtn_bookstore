const express = require("express");
const promotionRouter = express.Router();
const Gift = require("../models/gift");
const { Book } = require("../models/book");
const Promotion = require("../models/promotion");

promotionRouter.get("/check-gift", async (req, res) => {
  try {
    const finalPrice = req.query.finalPrice;
    if (isNaN(finalPrice) || finalPrice <= 0) {
      return res.status(400).json({ message: "Giá trị không hợp lệ" });
    }

    const gift = await Gift.findOne({ gift_price: { $lte: finalPrice } })
                           .sort({ gift_price: -1 });

    if (!gift) {
      return res.status(200).json({ message: "Không có quà tặng phù hợp" });
    }

    res.status(200).json({ gift });
  } catch (error) {
    console.error("Error checking gifts:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi kiểm tra quà tặng" });
  }
});


promotionRouter.get("/promotion/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ promotion_percent: -1 });
    if (books.length === 0) {
      return res.status(404).json({ message: "Không có sách nào được tìm thấy" });
    }
    res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy sách" });
  }
});

//lấy tát cả chương trình giảm giá
promotionRouter.get("/api/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('books');
    res.status(200).json({ promotions });
  } catch (error) {
    console.error("Error fetching promotions:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy khuyến mãi" });
  }
});

//lay khuyen mai theo id
promotionRouter.get("/api/promotion/:id", async (req, res) => {
  const promotionId = req.params.id;

  try {
    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
    }

    res.json(promotion);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khuyến mãi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
  }
});

//thêm mới khuyến mãi
promotionRouter.post("/api/addpromotion", async (req, res) => {
  const {
      description,
      image,
      status,
      type,
      code,
      value,
      conditional,
      limit,
      start_day,
      end_day,
      books
  } = req.body;

  try {
      const newPromotion = new Promotion({
          description,
          image,
          status,
          type,
          code,
          value,
          conditional,
          limit,
          start_day,
          end_day,
          books
      });

      await newPromotion.save();
      res.status(201).json({ message: "Thêm thành công" });
  } catch (error) {
      console.error("Lỗi không thể thêm khuyến mãi:", error);
      res.status(500).json({ message: "Lỗi server" });
  }
});


// Cập nhật khuyến mãi theo id
promotionRouter.put("/api/updatepromotion/:id", async (req, res) => {
  const promotionId = req.params.id;
  const updateData = req.body;

  try {
    const updatedPromotion = await Promotion.findByIdAndUpdate(promotionId, updateData, { new: true });

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi để cập nhật" });
    }

    res.status(200).json({ message: "Cập nhật thành công", promotion: updatedPromotion });
  } catch (error) {
    console.error("Lỗi khi cập nhật khuyến mãi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
  }
});

// Xóa khuyến mãi theo id
promotionRouter.delete("/api/deletepromotion/:id", async (req, res) => {
  const promotionId = req.params.id;

  try {
    const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

    if (!deletedPromotion) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi để xóa" });
    }

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa khuyến mãi:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ" });
  }
});

//Lấy quà tặng từ tên 
promotionRouter.get("/api/gift/:name", async (req, res) => {
  try {
      const gift = await Gift.findOne({ gifts: req.params.name });
      if (!gift) {
          return res.status(404).json({ message: 'Gift not found' });
      }
      res.json(gift);
  } catch (error) {
      console.error('Error fetching gift:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = promotionRouter;
