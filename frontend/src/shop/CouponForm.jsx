// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from './CartContext';
// import { UserContext } from '../authencation/UserContext';


// function CouponForm() {
    
//   const [couponCode, setCouponCode] = useState('');
//   const { 
//     cartItems, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity,
//     discountApplied, discountedPrice, totalPrice, setDiscountCode,
//     discountCode, setDiscountApplied, setDiscountedPrice, successMessage,
//     setSuccessMessage, errorMessage, setErrorMessage, setShippingCost
//   } = useContext(CartContext);
//   const { user } = useContext(UserContext);
//   const [discountCodeInput, setDiscountCodeInput] = useState('');
//   const [coupons, setCoupons] = useState([
//     {
//       code: 'MÃ GIẢM 10K - ĐƠN HÀNG TỪ 130K',
//       discount: '10K',
//       condition: 'Đơn hàng từ 130K',
//       applied: false,
//     },
//     {
//       code: 'MÃ GIẢM 10% TỐI ĐA 50K',
//       discount: '10%',
//       condition: 'Đơn hàng mua VPP DCHS từ 100K',
//       applied: false,
//     },
//     // ... thêm các mã khuyến mãi khác
//   ]);

//   const handleApplyCoupon = () => {
//     // Logic xử lý khi áp dụng mã khuyến mãi từ input
//   };

//   const handleApplyCouponItem = (index) => {
//     // Logic xử lý khi áp dụng từng mã khuyến mãi trong danh sách
//     const newCoupons = [...coupons];
//     newCoupons[index].applied = true;
//     setCoupons(newCoupons);
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <div className="mt-4">
//         {coupons.map((coupon, index) => (
//           <div key={index} className="border border-gray-200 rounded p-4 mb-2">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-bold">{coupon.code}</p>
//                 <p className="text-gray-600">{coupon.condition}</p>
//               </div>
//               <button
//                 className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${coupon.applied ? 'opacity-50' : ''}`}
//                 onClick={() => handleApplyCouponItem(index)}
//                 disabled={coupon.applied}
//               >
//                 Áp dụng
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CouponForm;






{/* <div className='flex flex-col'>
<div className="bg-white p-4 rounded-lg shadow mt-4 relative">
  <div className="flex items-center">
    <FaTag className="w-6 h-6 text-blue-500 mr-2" />
    <div>
      <h3 className="text-2xl font-bold">Chọn Khuyến Mãi</h3>
    </div>
  </div>
  <a href="#" className="text-blue-500 hover:underline text-xl absolute top-4 right-4 flex items-center" onClick={toggleCouponForm}>
    Xem thêm <span className="ml-1">&gt;</span>
  </a>
  {showCouponForm && <CouponForm />}
  <div className='mt-4'>
    <h4 className="text-lg font-bold">MÃ GIẢM 10K - ĐƠN HÀNG TỪ 130K</h4>
    <p className="text-gray-600">
      Không Áp Dụng Cho Ngoại Văn, Manga, Phiếu Quà Tặng, Sách Giáo Khoa, Máy Tính và Giấy Photo và Một...
    </p>
    <div className="progress mt-4">
      <div className="progress-bar bg-blue-500" role="progressbar" style={{ width: '100%' }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div className="flex justify-between items-center mt-2">
      <p className="text-sm">Mua thêm 130.000đ để nhận mã</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Mua Thêm</button>
    </div>
    <p className="text-gray-600 mt-2">2 khuyến mãi đủ điều kiện</p>
  </div>
</div>
</div> */}