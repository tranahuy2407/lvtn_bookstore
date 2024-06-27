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
    console.log(gift);
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


promotionRouter.get("/api/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json({ promotions });
  } catch (error) {
    console.error("Error fetching promotions:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy khuyến mãi" });
  }
});



module.exports = promotionRouter;
