const express = require("express");
const orderRouter = express.Router();
const Order = require("../models/order");
const ShippingCost = require("../models/shippingcost");
const { Book } = require("../models/book");
const Promotion = require("../models/promotion");
const SendMail = require("./sendmail");

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const qs = require('qs')

const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
//Licsh sử đơn hàng
orderRouter.get('/order/history', async (req, res) => {
  try {
    const completedOrders = await Order.find({ status: 4 });

    if (!completedOrders.length) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào đã hoàn thành.' });
    }

    res.json(completedOrders);
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình lấy danh sách đơn hàng đã hoàn thành.' });
  }
});

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
    // Tìm đơn hàng theo ID
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status > 1) {
      return res.status(400).json({ message: "Cannot cancel order that is already being processed or delivered." });
    }
    for (let item of order.books) {
      const book = await Book.findById(item.book._id);
      
      if (book) {
        book.quantity += item.quantity;
        await book.save();
      }
    }
    order.status = -1; 
    order.description = "Đơn hàng bị hủy"; 
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error('Error cancelling order:', error);
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

    for (let item of order.books) {
      const book = await Book.findById(item.book._id);
      
      if (book) {
        if (book.quantity < item.quantity) {
          return res.status(400).json({ message: `Not enough stock for book: ${book.name}` });
        }
        book.quantity -= item.quantity;
        await book.save();
      }
    }
    order.status = 0;
    order.description = "Đơn hàng trước đó bị hủy đã được đặt lại";
    await order.save();

    res.json({ message: "Order reset successfully", order });
  } catch (error) {
    console.error('Error resetting order:', error);
    res.status(500).json({ error: error.message });
  }
});


//lấy tất cả đơn hàng
orderRouter.get('/api/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name'); 
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

// Endpoint để cập nhật trạng thái đơn hàng và lưu lịch sử
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

    updatedOrder.statusHistory.push({ status });
    await updatedOrder.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});


//Đặt hàng
orderRouter.post('/api/orders', async (req, res) => {
  try {
    const { cart, totalPrice, address, paymentMethod, name, discountCode, discountedPrice, phone, userId, gift, email, note } = req.body;
    let products = [];

    for (let item of cart) {
      if (!item.book || !item.book._id) {
        console.error('Invalid product data:', item);
        return res.status(400).json({ msg: 'Dữ liệu sản phẩm không hợp lệ.' });
      }

      let product = await Book.findById(item.book._id);
      if (!product) {
        console.error('Product not found:', item.book._id);
        return res.status(404).json({ msg: 'Sản phẩm không tồn tại.' });
      }

      if (product.quantity >= item.quantity) {
        product.quantity -= item.quantity;
        products.push({ product, quantity: item.quantity });
        await product.save();
      } else {
        console.error('Product out of stock:', product.name);
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
      name,
      phone,
      note,
      gift: orderGift,
    };

    if (paymentMethod === 'zalopay') {
      const transID = Math.floor(Math.random() * 1000000);
      const embed_data = {
        redirecturl: "http://localhost:3000/order-success"
      };
      const items = orderBooks.map(book => ({
        name: book.book.name,
        quantity: book.quantity,
        price: book.book.price,
        orderBook: book.book
      }));
      const zaloPayOrder = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: name,
        app_time: Date.now(), 
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: discountedPrice || totalPrice,
        description: `Thanh toán đơn hàng tại HS BookStore`,
        bank_code: "",
        callback_url: "https://cbc6-27-74-241-88.ngrok-free.app/callback", 
      };

      const data = config.app_id + "|" + zaloPayOrder.app_trans_id + "|" + zaloPayOrder.app_user + "|" + zaloPayOrder.amount + "|" + zaloPayOrder.app_time + "|" + zaloPayOrder.embed_data + "|" + zaloPayOrder.item;
      zaloPayOrder.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      try {
        const result = await axios.post(config.endpoint, null, { params: zaloPayOrder });
        console.log('ZaloPay response:', result.data);
        if (result.data.return_code === 1) {
          const newOrder = new Order({
            ...orderData,
            orderToken: zaloPayOrder.app_trans_id,
            status: 5 
          });
          console.log("New Order before saving:", newOrder);
          await newOrder.save();
          await SendMail.sendEmailCreateOrder(email,orderData);
          return res.status(201).json({ 
            order: newOrder, 
            zaloPay: result.data,
            paymentUrl: result.data.order_url 
          });
        } else {
          console.error('ZaloPay order creation failed:', result.data);
          return res.status(400).json({ error: 'Không thể tạo đơn hàng với ZaloPay.' });
        }
      } catch (error) {
        console.error('ZaloPay API error:', error.message);
        return res.status(500).json({ error: 'Lỗi khi gọi API ZaloPay.' });
      }
    } else {
      const newOrder = new Order({ 
        ...orderData, 
        orderToken: null 
      });
      await newOrder.save();
      await SendMail.sendEmailCreateOrder(email,orderData);
      res.status(201).json(newOrder);
    }
  } catch (e) {
    console.error('Order creation error:', e);
    res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình đặt hàng.' });
  }
});

//Kiểm tra trạng thái thanh toán zalo
orderRouter.post('/api/orders-status/:app_trans_id', async (req, res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, 
}

let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; 
postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


let postConfig = {
    method: 'post',
    url: 	"https://sb-openapi.zalopay.vn/v2/query",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
};

axios(postConfig)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });

});

//calback
orderRouter.post('/callback', async (req, res) => {
  const result = {};
  const dataStr = req.body.data;
  const reqMac = req.body.mac;

  const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
  console.log("mac =", mac);

  if (reqMac !== mac) {
    result.return_code = -1;
    result.return_message = "mac not equal";
  } else {
    const dataJson = JSON.parse(dataStr);
    console.log("Parsed dataJson =", dataJson);

    const orderToken = dataJson.app_trans_id;
    console.log("order_token =", orderToken);

    // Find the order
    const orderToUpdate = await Order.findOne({ orderToken: orderToken });
    console.log("Order to update:", orderToUpdate);

    if (!orderToUpdate) {
      console.error('Order not found or failed to update:', orderToken);
      result.return_code = 0;
      result.return_message = 'Không tìm thấy đơn hàng để cập nhật trạng thái.';
    } else {
      // Update the order
      const updatedOrder = await Order.findOneAndUpdate(
        { orderToken: orderToken },
        { $set: { status: 0, description: 'Đơn hàng đã được thanh toán.' } },
        { new: true }
      );
      console.log("Order updated successfully:", updatedOrder);
      result.return_code = 1;
      result.return_message = "success";
    }
  }
  res.json(result);
});


//Lay don hang cua user co id
orderRouter.get('/api/orders/me/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const orders = await Order.find({ userId, status: { $lte: 3, $gte: -1 } });
    res.json(orders);
  } catch (e) {
    console.error('Error fetching orders:', e);
    res.status(500).json({
      error: 'Đã xảy ra lỗi trong quá trình lấy danh sách đơn hàng.',
    });
  }
});


// Route to confirm order
orderRouter.put('/order/:orderId/confirm', async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        status: 4,
        description: 'Đơn hàng đã được bạn xác nhận và đã giao đến bạn',
        updatedAt: new Date()
      },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'An error occurred while confirming the order.' });
  }
});


module.exports = orderRouter;
