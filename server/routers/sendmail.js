const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const axios = require('axios');
dotenv.config();

const sendEmailCreateOrder = async (email, orderData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const productsHtml = orderData.books.map(item => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <img src="${item.book.images}" alt="${item.book.name}" style="height: 50px; vertical-align: middle; margin-right: 10px;">
          ${item.book.name}
        </td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.book.promotion_price}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.book.promotion_price * item.quantity}</td>
      </tr>
    `).join('');

    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "Cảm ơn bạn đã đặt hàng từ HS BookStore ✔",
      text: "HS Bookstore cảm ơn bạn đã đặt hàng. Chúc bạn 1 ngày làm việc thật năng suất.",
      html: `
        <section style="max-width: 600px; margin: 0 auto; padding: 16px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
          <header style="text-align: center;">
            <img src="../../frontend/src/assets/Logo.jpg" alt="HS BookStore Logo" style="height: 50px; margin-bottom: 16px;">
          </header>
          <main>
            <h2>Chào ${orderData.name},</h2>
            <p>Cảm ơn bạn đã đặt hàng từ HS BookStore! Dưới đây là chi tiết đơn hàng của bạn:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Sản phẩm</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Giá</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Số lượng</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Tổng</th>
                </tr>
              </thead>
              <tbody>
                ${productsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tổng cộng (đã bao gồm phí vận chuyển):</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${orderData.totalPrice}</td>
                </tr>
              </tfoot>
            </table>
            <p>Địa chỉ giao hàng: ${orderData.address}</p>
            <p>Phương thức thanh toán: ${orderData.paymentMethod}</p>
            <p>HS Bookstore cảm ơn bạn đã đặt hàng. Chúc bạn một ngày làm việc thật năng suất.</p>
          </main>
          <footer style="text-align: center; margin-top: 16px;">
            <p>HS BookStore</p>
            <p><a href="https://localhost:3000" style="color: #1a0dab;">Truy cập website của chúng tôi</a></p>
          </footer>
        </section>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const sendEmailResetPassword = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "Bạn đã gửi yêu cầu cập nhật mật khẩu đến HS BookStore ✔",
      text: "HS Bookstore sẽ giúp bạn lấy lại mật khẩu. Chúc bạn một ngày làm việc thật năng suất.",
      html: `
        <p>Gặp khó khăn khi đăng nhập?</p>
        <p>Việc đặt lại mật khẩu của bạn rất đơn giản.</p>
        <p>Chỉ cần nhấp vào nút dưới đây và làm theo hướng dẫn. Chúng tôi sẽ giúp bạn lấy lại quyền truy cập ngay lập tức.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  
};


const sendEmailRequestReturn = async (email, requestData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const { returnReason, selectedBooks, orderCode, createAt, status } = requestData;
    const bookRequests = selectedBooks.map(id => axios.get(`https://3511-14-186-211-38.ngrok-free.app/api/products/${id}`));
    const responses = await Promise.all(bookRequests);
    const books = responses.map(response => response.data);
    const bookDetailsHtml = books.map(book => `
      <li>
        <strong>${book.name}</strong><br>
        <img src="${book.images}" alt="${book.name}" style="width: 100px; height: auto;" /><br>
      </li>
    `).join('');

    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "Bạn đã gửi yêu cầu đổi trả đến HS BookStore ✔",
      text: `HS Bookstore sẽ hỗ trợ bạn đổi trả, yêu cầu của bạn sẽ được xử lý trong vòng 24h. Chúc bạn một ngày làm việc thật năng suất.\n\n` +
            `Thông tin yêu cầu đổi trả:\n` +
            `- Đơn hàng: ${orderCode}\n` +
            `- Ngày tạo: ${new Date(createAt).toLocaleDateString()}\n` +
            `- Trạng thái: ${status === 0 ? 'Chờ xử lý' : 'Đã xử lý'}\n` +
            `- Lý do: ${returnReason}\n` +
            `- Sách yêu cầu: ${books.map(book => book.name).join(', ')}\n`,
      html: `
        <p>HS Bookstore sẽ hỗ trợ bạn đổi trả, yêu cầu của bạn sẽ được xử lý trong vòng 24h. Chúc bạn một ngày làm việc thật năng suất.</p>
        <p><strong>Thông tin yêu cầu đổi trả:</strong></p>
        <ul>
          <li><strong>Đơn hàng:</strong> ${orderCode}</li>
          <li><strong>Ngày tạo:</strong> ${new Date(createAt).toLocaleDateString()}</li>
          <li><strong>Trạng thái:</strong> ${status === 0 ? 'Chờ xử lý' : 'Đã xử lý'}</li>
          <li><strong>Lý do:</strong> ${returnReason}</li>
          <li><strong>Sách yêu cầu:</strong></li>
          <ul>
            ${bookDetailsHtml}
          </ul>
        </ul>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendEmailCreateOrder,
  sendEmailResetPassword,
  sendEmailRequestReturn
};
