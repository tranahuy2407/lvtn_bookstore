import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!order) {
    return <div className="bg-gray-100 h-screen">Đơn hàng không tồn tại!</div>;
  }

  const handleContinueShopping = () => {
    navigate('/all-shop');
  };

  const handleTrackOrder = () => {
    navigate(`/account/myorders/${order._id}`);
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6 md:mx-auto py-24">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          />
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Đặt hàng thành công!</h3>
          <p className="text-gray-600 my-2">Cảm ơn bạn đã mua sách tại cửa hàng.</p>
          <p> Chúc bạn có một ngày tốt lành! </p>
          <div className="py-10 text-center">
            <button
              onClick={handleTrackOrder}
              className={`px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 mx-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              Theo dõi đơn hàng 
            </button>
            <button
              onClick={handleContinueShopping}
              className="px-12 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 mx-2"
            >
              Tiếp tục mua sách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
