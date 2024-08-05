
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { UserContext } from '../authencation/UserContext';
import { useNavigate } from 'react-router-dom';
import empty from "../assets/empty.png";
import axios from 'axios';

const Cart = () => {
  const { 
    cartItems, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity,
    discountApplied, discountedPrice, totalPrice, setDiscountCode,
    discountCode, setDiscountApplied, setDiscountedPrice, successMessage,
    setSuccessMessage, errorMessage, setErrorMessage , setShippingCost
  } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [temporaryQuantities, setTemporaryQuantities] = useState({});
  const [remainingStock, setRemainingStock] = useState({});
  const navigate = useNavigate();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.cartQuantity, 0);

  useEffect(() => {
    setDiscountCode(discountCodeInput);
  }, [discountCodeInput, setDiscountCode]);

  useEffect(() => {
    const initialQuantities = {};
    const initialStock = {};

    cartItems.forEach((item) => {
      initialQuantities[item.cartId] = item.cartQuantity.toString();
      initialStock[item.cartId] = item.quantity - item.cartQuantity;
    });

    setTemporaryQuantities(initialQuantities);
    setRemainingStock(initialStock);
  }, [cartItems]);

  function continueShopping() {
    navigate('/all-shop');
  }

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  const applyDiscount = async () => {
    try {
      const response = await axios.post('http://localhost:5000/apply-promotion', { code: discountCodeInput, totalPrice: totalPrice, userId: user._id });
      if (response.status === 200) {
        const promotion = response.data.promotion;
        setSuccessMessage(response.data.message);
        setErrorMessage('');
        setDiscountApplied(true);
        setDiscountCode({
          code: promotion.code,
          type: promotion.type,
          value: promotion.value
        });
  
        let discountAmount = 0;
        if (promotion.type === 'percent') {
          discountAmount = (totalPrice * promotion.value) / 100;
        } else if (promotion.type === 'money') {
          discountAmount = promotion.value;
        } else if (promotion.type === 'ship') {
          setShippingCost(promotion.value);
          discountAmount = 0; 
        }
  
        setDiscountedPrice(totalPrice - discountAmount);
      }
    } catch (error) {
      console.error('Error applying discount:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.msg || 'Invalid request');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      setSuccessMessage('');
      setDiscountApplied(false);
    }
  };
  

  const handleTemporaryQuantityChange = (cartId, newQuantity) => {
    setTemporaryQuantities((prev) => ({
      ...prev,
      [cartId]: newQuantity
    }));

    const item = cartItems.find((item) => item.cartId === cartId);
    if (!item) return;

    let parsedQuantity = parseInt(newQuantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      parsedQuantity = 1;
    }

    if (parsedQuantity <= item.quantity) {
      setRemainingStock((prev) => ({
        ...prev,
        [cartId]: item.quantity - parsedQuantity
      }));
    }
  };

  const handleQuantityBlur = (cartId, newQuantity) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (!item) return;

    if (newQuantity === '') {
      newQuantity = 1;
    } else {
      newQuantity = parseInt(newQuantity, 10);
    }

    if (!isNaN(newQuantity) && newQuantity > 0) {
      if (newQuantity > item.quantity) {
        alert(`Số lượng vượt quá số lượng tồn kho (${item.quantity})`);
        setTemporaryQuantities((prev) => ({
          ...prev,
          [cartId]: item.quantity.toString()
        }));
        setRemainingStock((prev) => ({
          ...prev,
          [cartId]: 0
        }));
      } else {
        updateQuantity(cartId, newQuantity);
        setRemainingStock((prev) => ({
          ...prev,
          [cartId]: item.quantity - newQuantity
        }));
      }
    } else {
      updateQuantity(cartId, 1);
      setRemainingStock((prev) => ({
        ...prev,
        [cartId]: item.quantity - 1
      }));
    }
  };

  const handleDecreaseQuantity = (cartId) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (!item || item.cartQuantity <= 1) return;

    decreaseQuantity(cartId);
    setRemainingStock((prev) => ({
      ...prev,
      [cartId]: prev[cartId] + 1
    }));
  };

  const handleIncreaseQuantity = (cartId) => {
    const item = cartItems.find((item) => item.cartId === cartId);
    if (!item) return;

    if (item.cartQuantity < item.quantity) {
      increaseQuantity(cartId);
      setRemainingStock((prev) => ({
        ...prev,
        [cartId]: prev[cartId] - 1
      }));
    } else {
      alert(`Số lượng vượt quá số lượng tồn kho (${item.quantity})`);
    }
  };

  const handleDiscountCodeChange = (e) => {
    setDiscountCodeInput(e.target.value);
    setSuccessMessage('');
    setErrorMessage('');
    setDiscountApplied(false);
  };

  return (
    <div className='mt-28 px-4 lg:px-24'>
      <h2 className='text-5xl font-bold text-center'>Giỏ hàng</h2>
      {successMessage && <p className="p-4 mb-4 text-2xl text-green-500 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">{successMessage}</p>}
      {errorMessage && <p className="p-4 mb-4 text-2xl text-red-500 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">{errorMessage}</p>}
      {cartItems.length === 0 ? (
        <div className="text-center mt-12">
          <img src={empty} alt="Empty Cart" className="mx-auto w-64 h-64 mb-12" />
          <p className='text-4xl'>Giỏ hàng của bạn đang trống.</p>
          <button className='bg-blue-500 text-white font-semibold py-4 px-8 rounded mt-8' onClick={continueShopping}>Tiếp tục mua sách</button>
        </div>
      ) : (
        <div className='my-12'>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='py-2 text-center'>Ảnh</th>
                <th className='py-2 text-center'>Tên sách</th>
                <th className='py-2 text-center'>Số lượng</th>
  		          <th className='py-2'>Số lượng tồn kho</th>
                <th className='py-2 text-center'>Đơn giá</th>
                <th className='py-2 text-center'>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.cartId} className='border-t'>
                  <td className='py-4 text-center'>
                    <img src={item.images} alt={item.name} className='w-20 h-20 object-cover mx-auto' />
                  </td>
                  <td className='py-4 text-center'>{item.name}</td>
                  <td className='py-4 text-center'>
                    <div className='flex items-center justify-center'>
                      <button
                        className='bg-blue-500 font-semibold text-white py-2 px-4 rounded'
                        onClick={() => handleDecreaseQuantity(item.cartId)}
                      >
                        -
                      </button>
                      <input
                        type='text'
                        min='1'
                        value={temporaryQuantities[item.cartId] || ''}
                        className='cart-quantity-input mx-2 text-center'
                        onChange={(e) => handleTemporaryQuantityChange(item.cartId, e.target.value)}
                        onBlur={(e) => handleQuantityBlur(item.cartId, e.target.value)}
                      />
                      <button
                        className='bg-blue-500 font-semibold text-white py-2 px-4 rounded'
                        onClick={() => handleIncreaseQuantity(item.cartId)}
                      >
                        +
                      </button>
                    </div>
                  </td>
  		          	<td className='py-4 text-center'>
                    {remainingStock[item.cartId]}
                  </td>

                  <td className='py-4 text-center'>
                    {typeof item.promotion_price === 'number' ? (
                      item.promotion_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + ' x ' + temporaryQuantities[item.cartId] + ' = ' + ( item.promotion_price * temporaryQuantities[item.cartId]).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    ) : (
                      'Giá không có sẵn'
                    )}
                  </td>
                  <td className='py-4 text-center'>
                    <button className='bg-red-500 font-semibold text-white py-2 px-4 rounded' onClick={() => removeFromCart(item.cartId)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex justify-between mt-4'>
            <div>
              <input type="text" value={discountCodeInput} onChange={handleDiscountCodeChange} placeholder="Nhập mã giảm giá (nếu có)" className="mt-4 p-2 border border-gray-400 rounded" />
              <button className='bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2' onClick={applyDiscount}>Áp dụng</button>
            </div>
   		<div>
              <p className='text-xl font-semibold'>Tổng cộng: {totalQuantity} sản phẩm</p>
              <p className='text-xl font-semibold'>Thành tiền: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              <p className='text-xl font-semibold'>Số tiền được giảm: {(totalPrice - discountedPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              {discountApplied && (
                <p className='text-xl font-semibold'>Giá sau khi giảm giá: {discountedPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              )}
            </div>
          </div>
          <div className='flex justify-between mt-28'>
            <div>
              <button className='bg-blue-500 text-white font-semibold py-2 px-4 rounded mr-4' onClick={continueShopping}>Tiếp tục mua sách</button>
              <button className='bg-green-500 text-white font-semibold py-2 px-4 rounded' onClick={handleCheckout}>Thanh toán</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;



