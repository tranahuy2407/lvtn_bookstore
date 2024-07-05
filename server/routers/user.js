const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const Promotion = require("../models/promotion");

const User = require("../models/user");

//Nhập giảm giá
userRouter.post('/apply-promotion', async (req, res) => {
  try {
    const { code, totalPrice, userId } = req.body;
    const promotion = await Promotion.findOne({ code });
    if (!promotion) {
      return res.status(404).json({ message: 'Mã giảm giá không hợp lệ.' });
    }
    const currentDate = new Date();
    if (currentDate < promotion.start_day || currentDate > promotion.end_day) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết hạn.' });
    }
    if (promotion.usage_per_user.length >= promotion.limit) {
      return res.status(400).json({ msg: 'Mã giảm giá đã được sử dụng hết!' });
    }
    if (promotion.usage_per_user.includes(userId)) {
      return res.status(400).json({ msg: 'Bạn đã sử dụng mã giảm giá này rồi!' });
    }
    if (totalPrice < promotion.conditional) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });

      const formattedConditional = formatter.format(promotion.conditional);

      return res.status(400).json({ message: `Tổng giá phải lớn hơn hoặc bằng ${formattedConditional} để áp dụng mã giảm giá.` });
    }

    return res.status(200).json({ message: 'Mã giảm giá đã được áp dụng thành công.', promotion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi áp dụng mã giảm giá.' });
  }
});


//lấy tên theo id
userRouter.get("/api/getusername/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user name", error });
  }
});

module.exports = userRouter;
