const express = require("express");
const orderRouter = express.Router();
const Order = require("../models/order");
const ShippingCost = require("../models/shippingcost");
const { Book } = require("../models/book");
const Promotion = require("../models/promotion");

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const { v1:  uuid } = require('uuid');
const moment = require('moment'); // npm install moment

const config = {
  appid: "554",
  key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
  key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
  endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder",
  callbackurl: "https://39e9-27-74-241-88.ngrok-free.app/callback"
};



// Lấy thông tin chi tiết đơn hàng theo orderId
orderRouter.get("/order/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Lấy thông tin chi phí vận chuyển dựa trên tên tỉnh
orderRouter.get("/shipping-cost/:province", async (req, res) => {
  const provinceName = req.params.province.trim().toLowerCase();
  try {
    const shippingData = await ShippingCost.findOne({
      province: { $regex: new RegExp("^" + provinceName, "i") }
      
    });
    if (shippingData) {
      res.status(200).json({ cost: shippingData.cost });
    } else {
      res.status(404).json({ message: "Province not found" });
    }  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Hủy đơn hàng
orderRouter.put("/order/:orderId/cancel", async (req, res) => {
  try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      if (order.status > 1) {
          return res.status(400).json({ message: "Cannot cancel order that is already being processed or delivered." });
      }
      order.status = -1; 
      order.description = "Đơn hàng bị hủy"; 

      await order.save();

      res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Xóa đơn hàng
orderRouter.delete('/delete/order/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API để đặt lại đơn hàng đã hủy
orderRouter.put("/order/:orderId/reset", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== -1) {
      return res.status(400).json({ message: "Only cancelled orders can be reset." });
    }

    order.status = 0;
    order.description = "Đơn hàng trước đó bị hủy đã được đặt lại";
    await order.save();

    res.json({ message: "Order reset successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//lấy tất cả đơn hàng
orderRouter.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name'); // Populate userId with user's username and email
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

//api lấy đơn hàng dựa trên id
orderRouter.get("/api/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("userId", 'name');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//thay đổi trạng thái đơn hàng
orderRouter.post("/api/update-order-status", async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});



orderRouter.post('/api/orders', async (req, res) => {
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

    const orderData = {
      books: orderBooks,
      totalPrice: discountedPrice || totalPrice,
      address,
      userId: userId,
      orderedAt: new Date().getTime(),
      paymentMethod,
      phone,
      gift: orderGift,
    };

    if (paymentMethod === 'zalopay') {
      const embeddata = {
        redirecturl: "https://github.com/tranahuy2407"
      };
      const items = [{}]; 
      const zaloPayOrder = {
        appid: config.appid,
        apptransid: `${moment().format('YYMMDD')}_${uuid()}`,
        appuser: userId,
        apptime: Date.now(), 
        item: JSON.stringify(items),
        embeddata: JSON.stringify(embeddata),
        amount: discountedPrice || totalPrice,
        description: `Thanh toán đơn hàng`,
        bankcode: "",
        callbackurl: config.callbackurl
      };

      const data = config.appid + "|" + zaloPayOrder.apptransid + "|" + zaloPayOrder.appuser + "|" + zaloPayOrder.amount + "|" + zaloPayOrder.apptime + "|" + zaloPayOrder.embeddata + "|" + zaloPayOrder.item;
      zaloPayOrder.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      try {
        const result = await axios.post(config.endpoint, null, { params: zaloPayOrder });
        if (result.data.returncode === 1) {
          const newOrder = new Order(orderData);
          await newOrder.save();
          return res.status(201).json({ 
            order: newOrder, 
            zaloPay: result.data,
            paymentUrl: result.data.orderurl 
          });
        } else {
          return res.status(400).json({ error: 'Không thể tạo đơn hàng với ZaloPay.' });
        }
      } catch (error) {
        console.error('ZaloPay API error:', error.message);
        return res.status(500).json({ error: 'Lỗi khi gọi API ZaloPay.' });
      }
    } else {
      
      const newOrder = new Order(orderData);
      await newOrder.save();
      res.status(201).json(newOrder);
    }
  } catch (e) {
    console.error('Order creation error:', e);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đặt hàng.' });
  }
});


orderRouter.get('/api/orders/me/:userId', async (req, res) => {
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



// orderRouter.post('/api/payment-zalo', async (req, res) => {
//   // const { cart, totalPrice, discountedPrice, userId,} = req.body;
//           const embeddata = {
//             redirecturl: "https://github.com/tranahuy2407"
//           };
//           const items = [{}]; 
//           const order = {
//             appid: config.appid,
//             apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // Mã giao dịch có định dạng yyMMdd_xxxx
//             appuser: "Huy",
//             apptime: Date.now(), // Miliseconds
//             item: JSON.stringify(items),
//             embeddata: JSON.stringify(embeddata),
//             amount:20000,
//             // discountedPrice || totalPrice,
//             description: `Thanh toán đơn hàng`,
//             bankcode: "",
//             callbackurl: config.callbackurl
//           };
//           // Tạo chuỗi dữ liệu để tính mã MAC
//           const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
//           order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//           try {
//             const result = await axios.post(config.endpoint, null, { params: order });
//             return res.status(200).json(result.data);
//           } catch (error) {
//             console.log(error.message);
//             res.status(500).json({ error: 'Lỗi khi gọi API ZaloPay.' });
//           }
// });


// Route to handle ZaloPay callback
orderRouter.post('/callback', (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});


module.exports = orderRouter;
