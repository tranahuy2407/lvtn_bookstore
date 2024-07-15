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
          <section class="bg-gray-100 py-20">
            <div class="max-w-2xl mx-auto py-0 md:py-16">
              <article class="shadow-none md:shadow-md md:rounded-md overflow-hidden">
                <div class="md:rounded-b-md bg-white">
                  <div class="p-9 border-b border-gray-200">
                    <div class="space-y-6">
                      <div class="flex justify-between items-top">
                        <div class="space-y-4">
                          <div>
                            <span class="inline-block">HS Bookstore</span>
                            <p class="font-bold text-lg">Hóa đơn</p>
                            <p>HS Bookstore</p>
                          </div>
                          <div>
                            <p class="font-medium text-sm text-gray-400">Hóa đơn cho</p>
                            <p>Khách hàng: ${invoice.order.name}</p>
                            <p>Số điện thoại: ${invoice.order.phone}</p>
                          </div>
                        </div>
                        <div class="space-y-2">
                          <div>
                            <p class="font-medium text-sm text-gray-400">Mã hóa đơn</p>
                            <p>${invoice._id}</p>
                          </div>
                          <div>
                            <p class="font-medium text-sm text-gray-400">Ngày tạo</p>
                            <p>${new Date(invoice.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-9 border-b border-gray-200">
                    <p class="font-medium text-sm text-gray-400">Ghi chú</p>
                    <p class="text-sm">${invoice.note}</p>
                  </div>
                  <table class="w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr>
                        <th scope="col" class="px-9 py-4 text-left font-semibold text-gray-400">Sản phẩm</th>
                        <th scope="col" class="px-9 py-4 text-left font-semibold text-gray-400">Ảnh</th>
                        <th scope="col" class="py-3 text-left font-semibold text-gray-400">Giá gốc</th>
                        <th scope="col" class="py-3 text-left font-semibold text-gray-400">Giảm giá</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      ${invoice.order.books.map((item, index) => `
                        <tr key=${index}>
                          <td class="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                            <div>
                              <p>${item.book.name}</p>
                              <p class="text-sm text-gray-400">Số lượng: ${item.quantity}</p>
                            </div>
                          </td>
                          <td class="whitespace-nowrap text-gray-600 truncate">
                            <img src=${item.book.images} alt=${item.book.name} class="h-16 w-16 object-cover"/>
                          </td>
                          <td class="whitespace-nowrap text-gray-600 truncate">${item.book.price.toLocaleString()} VNĐ</td>
                          <td class="whitespace-nowrap text-gray-600 truncate">${item.book.promotion_price ? item.book.promotion_price.toLocaleString() : '0'} VNĐ</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <div class="p-9 border-b border-gray-200">
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-gray-500 text-sm">Tổng cộng</p>
                        </div>
                        <p class="text-gray-500 text-sm">${invoice.order.totalPrice.toLocaleString()} VNĐ</p>
                      </div>
                      <div class="flex justify-between">
                        <div>
                          <p class="text-gray-500 text-sm">Thuế</p>
                        </div>
                        <p class="text-gray-500 text-sm">0 VNĐ</p>
                      </div>
                    </div>
                  </div>
                  <div class="p-9 border-b border-gray-200">
                    <div class="space-y-3">
                      <div class="flex justify-between">
                        <div>
                          <p class="font-bold text-black text-lg">Thành tiền</p>
                        </div>
                        <p class="font-bold text-black text-lg">${invoice.order.totalPrice.toLocaleString()} VNĐ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        `;

        // Options for PDF generation
        const options = { format: 'A4' };

        // Generate PDF
        pdf.create(htmlContent, options).toStream((err, stream) => {
            if (err) {
                return res.status(500).json({ message: 'Error generating PDF', error: err });
            }

            // Set response headers
            const fileName = `invoice_${invoice._id}.pdf`;
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