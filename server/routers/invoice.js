const express = require("express");
const invoiceRouter = express.Router();
const Invoice = require("../models/invoice");
invoiceRouter.use(express.json());

// POST /invoices - Tạo hóa đơn mới
invoiceRouter.post("/add-invoices", async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Lỗi khi tạo hóa đơn mới" });
    }
});


module.exports = invoiceRouter;