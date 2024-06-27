import React from "react";
import VNpay from "../assets/vnpay_logo.jpg";
import ZaloPay from "../assets/ZaloPay_Logo.jpg";
import Cash from "../assets/Cash_Logo.jpg";
import MoMo from "../assets/MoMo_Logo.png";

const PaymentMethods = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="col-span-3">
      <p className="text-xs font-semibold text-gray-500">
        Phương thức thanh toán
      </p>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <label
            htmlFor="cod"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            Thanh toán khi nhận hàng
          </label>
          <img src={Cash} alt="Cash Logo" className="h-12 w-12" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="zalopay"
            name="paymentMethod"
            value="zalopay"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            checked={paymentMethod === "zalopay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <label
            htmlFor="zalopay"
            className="block text-sm font-medium text-gray-700"
          >
            Thanh toán ZaloPay
          </label>
          <img src={ZaloPay} alt="ZaloPay Logo" className="h-12 w-12" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="vnpay"
            name="paymentMethod"
            value="vnpay"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            checked={paymentMethod === "vnpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <label
            htmlFor="vnpay"
            className="block text-sm font-medium text-gray-700"
          >
            Thanh toán VNPay
          </label>
          <img src={VNpay} alt="VNPay Logo" className="h-12 w-12" />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="momo"
            name="paymentMethod"
            value="momo"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            checked={paymentMethod === "momo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          />
          <label
            htmlFor="momo"
            className="block text-sm font-medium text-gray-700"
          >
            Thanh toán MoMo
          </label>
          <img src={MoMo} alt="MoMo Logo" className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
