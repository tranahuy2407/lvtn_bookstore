import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../authencation/UserContext';
import { Link } from 'react-router-dom'
const OrderMe = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/me/${user._id}`);
        setOrders(response.data);
        setLoading(false);
   
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id]);

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
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold">Mã đơn hàng: #{order._id}</h3>
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
                        <p className="mr-4">Giảm còn: {item.book.promotion_price.toLocaleString()} VNĐ x1</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-2">Không có sản phẩm nào trong đơn hàng này.</li>
                )}
                <li className="py-2 flex items-center justify-between">
                  <span className="font-bold">Tổng cộng:</span>
                  <span>{order.totalPrice.toLocaleString()} VNĐ</span>
                </li>
                <li className="py-2 flex items-center justify-end">
                  <Link to={`/account/myorders/${order._id}`}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Theo dõi đơn hàng
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderMe;
