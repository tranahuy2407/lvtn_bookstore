import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/order/history');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching completed orders:', err);
        setError('Đã xảy ra lỗi trong quá trình lấy danh sách đơn hàng đã hoàn thành.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Lịch sử đơn hàng</h1>
          <p className="mt-2 text-sm text-gray-500">
            Kiểm tra các đơn đặt hàng gần đây, quản lý trả lại và tải hóa đơn xuống.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Đơn đặt gần đây</h2>

          <div className="space-y-20">
            {orders.map((order) => (
              <div key={order._id}>
                <h3 className="sr-only">
                  Đặt hàng <time dateTime={new Date(order.orderedAt).toISOString()}>{new Date(order.orderedAt).toLocaleDateString()}</time>
                </h3>

                <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                  <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                    <div className="flex justify-between sm:block">
                      <dt className="font-medium text-gray-900">Ngày đặt</dt>
                      <dd className="sm:mt-1">
                        <time dateTime={new Date(order.orderedAt).toISOString()}>{new Date(order.orderedAt).toLocaleDateString()}</time>
                      </dd>
                    </div>
                    <div className="flex justify-between pt-6 sm:block sm:pt-0">
                      <dt className="font-medium text-gray-900">Mã đơn hàng</dt>
                      <dd className="sm:mt-1">{order.orderCode}</dd>
                    </div>
                    <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                      <dt>Tổng cộng</dt>
                      <dd className="sm:mt-1">{order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <Link
                      to={`/ratings/${order._id}`}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                    >
                      Đánh giá đơn hàng
                      <span className="sr-only">cho mã đơn {order._id}</span>
                    </Link>
                    <Link
                      to={`/invoice/${order._id}`}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                    >
                      Xem hóa đơn
                      <span className="sr-only">cho mã đơn {order._id}</span>
                    </Link>
                  </div>
                </div>

                <table className="mt-4 w-full text-gray-500 sm:mt-6">
                  <caption className="sr-only">Sản phẩm</caption>
                  <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                    <tr>
                      <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">Sản phẩm</th>
                      <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Đơn giá</th>
                      <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Số lượng</th>
                      <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">Nhận hàng lúc</th>
                      <th scope="col" className="w-0 py-3 text-right font-normal">Xem sản phẩm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                    {order.books.map((product, index) => (
                      <tr key={index}>
                        <td className="py-6 pr-8">
                          <div className="flex items-center">
                            <img
                              src={product.book.images || 'https://via.placeholder.com/64'}
                              alt={product.book.imageAlt || 'Sản phẩm'}
                              className="mr-6 h-16 w-16 rounded object-cover object-center"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{product.book.name}</div>
                              <div className="mt-1 sm:hidden">{product.book.promotion_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-6 pr-8 sm:table-cell">{product.book.promotion_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                        <td className="hidden py-6 pr-8 sm:table-cell">{product.quantity}</td>
                        <td className="hidden py-6 pr-8 sm:table-cell">{new Date(order.orderedAt).toLocaleDateString()}</td>
                        <td className="whitespace-nowrap py-6 text-right font-medium">
                          <Link to={`/book/${product.book._id}`} className="text-indigo-600">Chi tiết<span className="hidden lg:inline"> sản phẩm</span><span className="sr-only">, {product.book.name}</span></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
