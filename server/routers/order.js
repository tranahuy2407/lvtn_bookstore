const express = require("express");
const orderRouter = express.Router();
const Order = require("../models/order");
const ShippingCost = require("../models/shippingcost");

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

module.exports = orderRouter;
