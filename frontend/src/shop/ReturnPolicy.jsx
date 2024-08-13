// ReturnPolicy.js
import React from 'react';

const ReturnPolicy = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h2 className="text-gray-800 text-2xl font-bold sm:text-3xl">Chính sách đổi trả của HS Bookstore</h2>
        <p className="text-gray-600 mt-4">
          Thời gian áp dụng đổi/trả
        </p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li><strong>Sản phẩm lỗi (do nhà cung cấp):</strong> Đổi mới trong 7 ngày đầu tiên, bảo hành từ 8-30 ngày, không hỗ trợ đổi trả sau 30 ngày.</li>
          <li><strong>Sản phẩm không lỗi:</strong> Đổi mới trong 30 ngày đầu tiên, không hỗ trợ đổi trả sau 30 ngày.</li>
          <li><strong>Voucher/E-voucher:</strong> Đổi mới trong 30 ngày đầu tiên, không hỗ trợ đổi trả sau 30 ngày.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Quý khách vui lòng thông báo về cho HS Bookstore qua hotline 0343899504 hoặc email tranahuy247@gmail.com ngay khi:
        </p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li>Kiện hàng có dấu hiệu hư hại trong vòng 2 ngày kể từ khi nhận hàng.</li>
          <li>Sản phẩm giao bị sai hoặc thiếu hàng trong vòng 2 ngày kể từ khi nhận hàng.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Sau khi xác nhận yêu cầu, HS Bookstore sẽ liên hệ để xác nhận thông tin hoặc yêu cầu bổ sung thông tin nếu cần. Thời gian liên hệ trong giờ hành chính là tối đa 3 lần trong vòng 7 ngày sau khi nhận thông tin yêu cầu.
        </p>
        <p className="text-gray-600 mt-4">
          Các trường hợp yêu cầu đổi trả bao gồm:
        </p>
        <ul className="list-disc pl-5 mt-4 text-gray-700">
          <li>Lỗi kỹ thuật của sản phẩm.</li>
          <li>Giao nhầm/giao thiếu.</li>
          <li>Chất lượng hàng hóa kém, hư hại do vận chuyển.</li>
          <li>Hình thức sản phẩm không giống mô tả ban đầu.</li>
          <li>Khách đặt nhầm/không còn nhu cầu.</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Điều kiện đổi trả bao gồm sản phẩm còn nguyên bao bì, đầy đủ phụ kiện, quay video ngắn lúc unbox sản phẩm và tải hóa đơn của đơn hàng để upload lên. 
        </p>
        <p className="text-gray-600 mt-4">
          Cách thức chuyển sản phẩm đổi trả và thời gian hoàn tiền cũng được quy định rõ trong chính sách này.
        </p>
      </div>
    </section>
  );
};

export default ReturnPolicy;
