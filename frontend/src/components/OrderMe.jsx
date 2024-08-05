import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../authencation/UserContext';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { da, vi } from 'date-fns/locale';
import { FaUserCircle } from 'react-icons/fa';

const OrderMe = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftDetails, setGiftDetails] = useState({});
  const [shippingCosts, setShippingCosts] = useState({});

  const extractProvince = (address) => {
    const lastCommaIndex = address.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      return address.slice(lastCommaIndex + 1).trim();
    }
    return address;
  };

  const fetchShippingCost = async (province) => {
    try {
      const response = await fetch(`http://localhost:5000/shipping-cost/${province}`);
      const data = await response.json();
      return data.cost;
    } catch (error) {
      console.error('Error fetching shipping cost:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/me/${user._id}`);
        const ordersData = response.data;
        setOrders(ordersData);
        setLoading(false);

        for (const order of ordersData) {
          if (order.gift) {
            fetchGiftDetails(order.gift);
          }

          const province = extractProvince(order.address);
          const shippingCost = await fetchShippingCost(province);
          setShippingCosts(prevCosts => ({
            ...prevCosts,
            [order._id]: shippingCost
          }));
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    const fetchGiftDetails = async (giftName) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gift/${giftName}`);
        setGiftDetails(prevDetails => ({
          ...prevDetails,
          [giftName]: response.data
        }));
      } catch (error) {
        console.error('Error fetching gift details:', error);
      }
    };

    fetchOrders();
  }, [user._id]);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
    if (!confirmDelete) {
      return; 
    }

    try {
      await axios.delete(`http://localhost:5000/delete/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleResetOrder = async (orderId) => {
    const confirmReset = window.confirm('Bạn có chắc chắn muốn đặt lại đơn hàng này?');
    if (!confirmReset) {
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/order/${orderId}/reset`);
      setOrders(orders.map(order => order._id === orderId ? response.data.order : order));
    } catch (error) {
      console.error('Error resetting order:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p className="text-center py-4">Không có đơn hàng nào.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => {
            const totalProductPrice = order.books.reduce((acc, item) => acc + (item.quantity * item.book.promotion_price), 0);
            const shippingCost = shippingCosts[order._id] || 0;
            const finalTotalPrice = order.totalPrice; 
            const appliedDiscount = finalTotalPrice - (totalProductPrice + shippingCost) ;

            const formattedDate = order.orderedAt
              ? format(parseISO(order.orderedAt), "d MMMM yyyy 'lúc' h:mm a", { locale: vi })
              : 'N/A';

            return (
              <div key={order._id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold">Mã đơn hàng: {order.orderCode}</h3>
                <p className="text-gray-600 mb-4">Thời gian đặt: {formattedDate}</p>
                <ul className="divide-y divide-gray-200">
                  {order.books && order.books.length > 0 ? (
                    order.books.map((item, index) => (
                      <li key={index} className="py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img src={item.book.images} className="w-12 h-12 object-cover" alt="product" />
                          <p>{item.book.name}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="mr-4">{item.quantity} x {item.book.price.toLocaleString()} VNĐ</p>
                          <p className="mr-4">Giảm còn: {item.book.promotion_price.toLocaleString()} VNĐ x{item.quantity}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="py-2">Không có sản phẩm nào trong đơn hàng này.</li>
                  )}
                  {order.gift && (
                    <li className="py-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={giftDetails[order.gift]?.image} className="w-12 h-12 object-cover" alt="gift" />
                        <p>{order.gift}</p>
                      </div>
                      <div className="flex items-center">
                        <p className="mr-4">Miễn phí</p>
                      </div>
                    </li>
                  )}
                  <li className="py-2 flex items-center justify-end">
                    {order.status === -1 ? (
                      <>
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                          onClick={() => handleResetOrder(order._id)}
                        >
                          Đặt lại đơn 
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                          Xóa đơn
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to={`/account/myorders/${order._id}`}
                          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                        >
                          Theo dõi đơn hàng
                        </Link>
                        <Link to={`/invoice/${order._id}`}
                          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                          Xem hóa đơn
                        </Link>
                      </>
                    )}
                  </li>
                </ul>
                <div className="flex flex-col md:flex-row md:space-x-6 xl:space-x-8 mt-4">
                  <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full max-w-md bg-gray-50 space-y-6">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Tóm tắt</h3>
                    <div className="flex flex-col space-y-4 border-gray-200 border-b pb-4">
                      <div className="flex justify-between">
                        <p className="text-base leading-4 text-gray-800">Tổng tiền sản phẩm</p>
                        <p className="text-base leading-4 text-gray-600">{totalProductPrice.toLocaleString()} VNĐ</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base leading-4 text-gray-800">Giảm giá</p>
                        <p className="text-base leading-4 text-gray-600">-{appliedDiscount.toLocaleString()} VNĐ</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-base leading-4 text-gray-800">Tiền ship</p>
                        <p className="text-base leading-4 text-gray-600">{shippingCost.toLocaleString()} VNĐ</p>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-4">
                        <p className="text-base font-bold leading-4 text-gray-800">Tổng cộng</p>
                        <p className="text-base font-bold leading-4 text-gray-800">{finalTotalPrice.toLocaleString()} VNĐ</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col xl:flex-row bg-gray-50 w-full xl:w-1/2 px-4 py-6 md:p-6 xl:p-8 space-y-4 xl:space-y-0">
                    <div className="flex flex-col items-center">
                      <FaUserCircle className="w-24 h-24 text-gray-500 mb-4" />
                      <div className="text-center">
                        <p className="text-base font-semibold leading-4 text-gray-800">{order.name}</p>
                        <p className="text-sm leading-5 text-gray-600">{orders.length} Đơn hàng đã đặt</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4 mt-4 xl:mt-0 xl:ml-6">
                      <h3 className="text-xl font-semibold leading-4 text-gray-800">Thông tin giao hàng</h3>
                      <div className="flex flex-col">
                        <p className="text-base font-semibold leading-4 text-gray-800">Địa chỉ</p>
                        <p className="text-sm leading-5 text-gray-600">{order.address}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-base font-semibold leading-4 text-gray-800">Số điện thoại</p>
                        <p className="text-sm leading-5 text-gray-600">{order.phone}</p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-base font-semibold leading-4 text-gray-800">Email</p>
                        <p className="text-sm leading-5 text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderMe;
