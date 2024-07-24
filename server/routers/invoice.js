const express = require("express");
const invoiceRouter = express.Router();
const Invoice = require("../models/invoice");
const Order = require("../models/order"); 
const pdf = require('html-pdf');



// POST /invoices - Tạo hóa đơn mới
invoiceRouter.post('/invoices', async (req, res) => {
    try {
        const { orderId, note } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const newInvoice = new Invoice({
            order: orderId,
            note: note || '',
        });
        console.log(newInvoice)
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating invoice', error });
    }
});

// GET /invoices/:orderId - Get invoice by orderId
invoiceRouter.get('/invoices/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const invoice = await Invoice.findOne({ order: orderId }).populate('order');

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error });
    }
});

// GET /invoices/:orderId/pdf - Download invoice PDF
invoiceRouter.get('/invoices/:orderId/pdf', async (req, res) => {
    try {
        const { orderId } = req.params;
        const invoice = await Invoice.findOne({ order: orderId }).populate('order');
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
          // HTML content
          const htmlContent = `
        <section style="background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: auto; padding: 10px; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <header style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
              <h1 style="font-size: 24px; margin: 0;">HS Bookstore</h1>
              <h2 style="font-size: 18px; margin: 0;">Hóa đơn</h2>
              <p>Khách hàng: ${invoice.order.name}</p>
              <p>Số điện thoại: ${invoice.order.phone}</p>
              <p>Mã hóa đơn: ${invoice.invoiceCode}</p>
              <p>Ngày tạo: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
            </header>
            <main>
              <p><strong>Ghi chú:</strong> ${invoice.note}</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 10px;">
                <thead>
                  <tr>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Sản phẩm</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Ảnh</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Giá gốc</th>
                    <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: right;">Giảm giá</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.order.books.map(item => `
                    <tr>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.book.name} (Số lượng: ${item.quantity})</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd;"><img src="${item.book.images}" style="height: 50px; width: auto;" /></td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.book.price.toLocaleString()} VNĐ</td>
                      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.book.promotion_price ? item.book.promotion_price.toLocaleString() : '0'} VNĐ</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="margin-top: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <p>Tổng cộng:</p>
                  <p>${invoice.order.totalPrice.toLocaleString()} VNĐ</p>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <p>Thuế:</p>
                  <p>0 VNĐ</p>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-weight: bold;">Thành tiền:</p>
                  <p style="font-weight: bold;">${invoice.order.totalPrice.toLocaleString()} VNĐ</p>
                </div>
              </div>
            </main>
          </div>
        </section>
        `;

        // Options for PDF generation
        const options = { format: 'A6', margin: [10, 10] };

        // Generate PDF
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ message: 'Error generating PDF', error: err });
            }

            // Set response headers
            const fileName = `invoice_${invoice.orderCode}.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/pdf');

            // Pipe the PDF into the response
            stream.pipe(res);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error });
    }
});


module.exports = invoiceRouter;