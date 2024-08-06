import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/order/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const formatDateVN = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Đang xử lý';
      case 1:
        return 'Đã nhận đơn';
      case 2:
        return 'Đang giao hàng';
      case 3:
        return 'Đã giao hàng';
      case 4:
        return 'Đơn hàng đã được bạn xác nhận đax giao';
      case 5:
        return 'Đơn hàng đang thanh toán và đang xử lý trong hệ thống';
      case -1:
        return 'Đơn hàng bị hủy';
      default:
        return '';
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/order/${orderId}/cancel`);
      setOrder(response.data.order);
      alert('Đã hủy đơn hàng thành công!');
      navigate(`/account/myorders`);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Đã xảy ra lỗi khi hủy đơn hàng.');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/order/${orderId}/confirm`);
      setOrder(response.data); 
      alert('Đã xác nhận đơn hàng thành công!');
      navigate(`/account/orderhistory`);
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Đã xảy ra lỗi khi xác nhận đơn hàng.');
    }
  };

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
          Theo dõi mã đơn hàng của bạn có mã: {order.orderCode}
        </h2>

        <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
          <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
            {order.books.map((item, index) => (
              <div key={index} className="space-y-4 p-6">
                <div className="flex items-center gap-6">
                  <a href="#" className="h-14 w-14 shrink-0">
                    <img className="h-full w-full dark:hidden" src={item.book.images} alt="product image" />
                  </a>
                  <Link to={`/book/${item.book._id}`} href="#" className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white">
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
              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng (Đã bao gồm phí vận chuyển): </dt>
                <dd className="text-lg font-bold text-gray-900 dark:text-white">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</dd>
              </dl>
            </div>
          </div>

          <div className="mt-6 grow sm:mt-8 lg:mt-0">
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tiến độ đơn hàng</h3>

              <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                {order.statusHistory.map((history, index) => (
                  <li key={index} className={`ml-6 ${index !== 0 ? 'mt-6' : ''}`}>
                    <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ${
                      order.status >= history.status ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <svg className={`w-6 h-6 ${
                        order.status >= history.status ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'
                      }`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <h3 className={`text-base font-medium leading-tight ${order.status === history.status ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {getStatusText(history.status)}
                      {order.status === history.status && (
                        <svg className="h-5 w-5 text-green-500 ml-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                      )}
                    </h3>
                    <time className="mb-1 block text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {formatDateVN(history.updatedAt)}
                    </time>
                  </li>
                ))}
              </ol>

              {order.status === 3 && (
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  onClick={handleConfirmOrder}
                >
                  Xác nhận đã nhận hàng
                </button>
              )}

              {order.status <= 1 && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
