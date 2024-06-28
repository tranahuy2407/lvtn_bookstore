const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const Promotion = require("../models/promotion");
const { Book } = require("../models/book");
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

userRouter.post('/api/order', async (req, res) => {
  try {
    const { cart, totalPrice, address, paymentMethod, discountCode, discountedPrice, phone, userId, gift } = req.body;
    let products = [];

    for (let item of cart) {
      if (!item.book || !item.book._id) {
        return res.status(400).json({ msg: 'Dữ liệu sản phẩm không hợp lệ.' });
      }

      let product = await Book.findById(item.book._id);
      if (!product) {
        return res.status(404).json({ msg: 'Sản phẩm không tồn tại.' });
      }

      if (product.quantity >= item.quantity) {
        product.quantity -= item.quantity;
        products.push({ product, quantity: item.quantity });
        await product.save();
      } else {
        return res.status(400).json({ msg: `${product.name} tạm hết hàng!` });
      }
    }

    if (discountCode) {
      const promotion = await Promotion.findOne({ code: discountCode });
      if (promotion) {
        promotion.usage_per_user.push(userId);
        promotion.limit -= 1;
        await promotion.save();
      }
    }

    const orderGift = gift || "Không có quà tặng";

    const orderBooks = cart.map(item => ({
      book: {
        ...item.book,
        promotion_percent: item.book.promotion_percent !== undefined ? item.book.promotion_percent : 0
      },
      quantity: item.quantity
    }));

    const order = new Order({
      books: orderBooks,
      totalPrice: discountedPrice || totalPrice,
      address,
      userId: userId,
      orderedAt: new Date().getTime(),
      paymentMethod,
      phone,
      gift: orderGift,
    });
    
    await order.save();

    res.status(201).json(order);
  } catch (e) {
    console.error('Order creation error:', e);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đặt hàng.' });
  }
});


userRouter.get('/api/orders/me/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (e) {
    console.error('Error fetching orders:', e);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình lấy danh sách đơn hàng.',
    });
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
