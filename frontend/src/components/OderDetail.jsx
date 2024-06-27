import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/order/${orderId}`);
        setOrder(response.data);
        console.log(order)
        setLoading(false);

      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl py-24 px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Theo dõi mã đơn hàng của bạn có mã: #{order._id}
        </h2>

        <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
          <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
            {order.books.map((item, index) => (
              <div key={index} className="space-y-4 p-6">
                <div className="flex items-center gap-6">
                  <a href="#" className="h-14 w-14 shrink-0">
                    <img className="h-full w-full dark:hidden" src={item.book.images} alt="product image" />
                  </a>
                  <Link to={`/book/${item.book._id}`}href="#" className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white">
                    {item.book.name}
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Mã sản phẩm :</span> #{item.book._id}
                  </p>

                  <div className="flex items-center justify-end gap-4">
                    <p className="text-base font-normal text-gray-900 dark:text-white">x{item.quantity} </p>
                    <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{item.book.promotion_price.toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-800">
              <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                  <dt className="font-normal text-gray-500 dark:text-gray-400">Giá ship :</dt>
                  <dd className="text-base font-medium text-green-500">0 VNĐ</dd>
                </dl>
              </div>

              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng</dt>
                <dd className="text-lg font-bold text-gray-900 dark:text-white">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</dd>
              </dl>
            </div>
          </div>

          <div className="mt-6 grow sm:mt-8 lg:mt-0">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tiến độ đơn hàng</h3>

              <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                {[
                  { date: '24 Nov 2023', status: 'Đã giao' },
                  { date: 'Today', status: 'Đang giao' },
                  { date: '23 Nov 2023, 15:15', status: 'Đã nhận đơn' },
                  { date: '22 Nov 2023, 12:27', status: 'Đang xử lý' },
                ].map((history, index) => (
                  <li key={index} className={`ml-6 ${index !== 0 ? 'mt-6' : ''}`}>
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                      </svg>
                    </span>
                    <h3 className="text-base font-medium leading-tight text-gray-900 dark:text-white">{history.status}</h3>
                    <time className="mb-1 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{history.date}</time>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
