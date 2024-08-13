const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const Promotion = require("../models/promotion");
const ReturnBook = require("../models/returnbook");
const User = require("../models/user");
const { sendEmailRequestReturn } = require('./sendmail'); 

// Nhập giảm giá
userRouter.post('/apply-promotion', async (req, res) => {
  try {
    const { code, totalPrice, userId, cartItems } = req.body;
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

    const booksInPromotion = promotion.books.map(book => book._id.toString());
    const allBooksEligible = cartItems.every(item => booksInPromotion.includes(item.bookId));

    if (!allBooksEligible) {
      return res.status(400).json({ message: 'Một hoặc nhiều sách trong giỏ hàng không đủ điều kiện để áp dụng mã giảm giá.' });
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


// Xử lý yêu cầu đổi trả
userRouter.post('/api/return', async (req, res) => {
  const { returnReason, selectedBooks, fileUrl, userId, orderCode } = req.body;

  if (!returnReason || !selectedBooks || !Array.isArray(selectedBooks) || !userId || !orderCode) {
    return res.status(400).json({ message: 'Thông tin yêu cầu không hợp lệ.' });
  }

  try {
    const formattedOrderCode = `#${orderCode}`;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    const order = await Order.findOne({ orderCode: formattedOrderCode });
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại.' });
    }

    const existingReturnRequest = await ReturnBook.findOne({ order: order._id });
    if (existingReturnRequest) {
      return res.status(400).json({ message: 'Yêu cầu đổi trả cho đơn hàng này đã được gửi trước đó.' });
    }

    const booksInOrder = order.books.map(book => book.book._id.toString());

    const allBooksValid = selectedBooks.every(bookId => booksInOrder.includes(bookId));
    if (!allBooksValid) {
      return res.status(400).json({ message: 'Một hoặc nhiều sách không hợp lệ.' });
    }

    const newReturnRequest = await ReturnBook.create({
      reason: returnReason,
      invoice: fileUrl,
      order: order._id,
      books: selectedBooks,
      status: 0,
      userId: userId,
    });

    // Gửi email thông báo
    await sendEmailRequestReturn(user.email, {
      returnReason,
      selectedBooks,
      orderCode: formattedOrderCode,
      createAt: newReturnRequest.createAt,
      status: newReturnRequest.status
    });

    res.status(201).json({ message: 'Yêu cầu đổi trả đã được gửi thành công!', returnRequest: newReturnRequest });
  } catch (error) {
    console.error('Error handling return request:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu đổi trả.' });
  }
});


//Lay danh sach yeu cau
userRouter.get('/api/returns/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const returns = await ReturnBook.find({ userId })
      .populate({
        path: 'order',
        select: 'orderCode orderedAt address name' 
      })
      .populate({
        path: 'books'
      })
    res.json(returns);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching return requests', error });
  }
});


// Xử lý cập nhật yêu cầu đổi trả
userRouter.put('/api/returns/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const returnRequest = await ReturnBook.findById(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Yêu cầu đổi trả không tồn tại.' });
    }
    returnRequest.status = status;
    if (status === 2) {
      returnRequest.note = 'Khách hàng chọn đổi đơn hàng';
    }

    await returnRequest.save();
    res.json({ message: 'Yêu cầu đổi trả đã được cập nhật thành công.', returnRequest });
  } catch (error) {
    console.error('Error updating return request:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật yêu cầu đổi trả.' });
  }
});

// lấy đơn đổi trả
userRouter.get('/api/returnbooks', async (req, res) => {
  try {
    const returnBooks = await ReturnBook.find()
      .populate('order')  // Populate to get order details
      .populate('books')  // Populate to get book details
      .populate('userId'); // Populate to get user details
    
    res.status(200).json(returnBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving return books', error: error.message });
  }
});

//thay đổi trạng thái
userRouter.put('/api/returnbooks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const updatedReturnBook = await ReturnBook.findByIdAndUpdate(
      id, 
      { status: status }, 
      { new: true }
    );

    if (!updatedReturnBook) {
      return res.status(404).json({ message: 'Đơn đổi trả không tồn tại' });
    }

    res.status(200).json({ message: 'Trạng thái đã được cập nhật thành công', updatedReturnBook });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: error.message });
  }
});

module.exports = userRouter;
