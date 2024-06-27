const express = require("express");
const orderRouter = express.Router();
const Order = require("../models/order");
const Shipping = require("../models/shipping_cost");

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

orderRouter.get("/api/shipping-cost/:province", async (req, res) => {
    const provinceName = req.params.province;
    console.log(Shipping)
    try {
      const shippingData = await Shipping.findOne({ province: provinceName });
  
      if (shippingData) {
        res.status(200).json({ cost: shippingData.cost });
      } else {
        res.status(404).json({ message: 'Province not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  });
  
module.exports = orderRouter;
