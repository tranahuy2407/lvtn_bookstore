import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../authencation/UserContext";
import PaymentMethods from "./PaymentMethods";

const Checkout = () => {
  const {
    cartItems,
    discountCode,
    discountApplied,
    discountedPrice,
    totalPrice,
    clearCart,
  } = useContext(CartContext);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [gift, setGift] = useState(null);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [shippingCost, setShippingCost] = useState(0);
  const [provinceCost, setProvinceCost] = useState("");

  // Hàm để tách tỉnh từ địa chỉ
  const extractProvince = (address) => {
    const lastCommaIndex = address.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      return address.slice(lastCommaIndex + 1).trim();
    }
    return address;
  };

  // Lấy thông tin người dùng từ UserContext khi component mount
  useEffect(() => {
    if (user) {
      setUserId(user._id);
      setFullName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
      setProvinceCost(extractProvince(user.address));
    }
  }, [user]);

  // Tính phí vận chuyển khi có tỉnh hoặc địa chỉ mặc định thay đổi
  useEffect(() => {
    const provinceToUse = useDefaultAddress ? provinceCost : province?.full_name;
    if (provinceToUse) {
      fetch(`http://localhost:5000/shipping-cost/${provinceToUse}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.cost) {
            setShippingCost(data.cost);
          } else {
            setShippingCost(0);
            setErrorMessage("Không tìm thấy thông tin vận chuyển cho tỉnh này.");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin vận chuyển:", error);
          setErrorMessage("Đã xảy ra lỗi khi lấy thông tin vận chuyển.");
        });
    }
  }, [province, useDefaultAddress]);

  // Lấy danh sách tỉnh thành khi component mount
  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);
        } else {
          setErrorMessage("Không thể lấy danh sách tỉnh thành.");
        }
      })
      .catch((error) => {
        setErrorMessage("Đã xảy ra lỗi trong quá trình lấy dữ liệu.");
      });
  }, []);

  // Xử lý thay đổi tỉnh
  const handleProvinceChange = (e) => {
    const selectedProvince = provinces.find(
      (province) => province.full_name === e.target.value
    );
    setProvince(selectedProvince);

    fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setDistricts(data.data);
          setDistrict("");
        } else {
          setErrorMessage("Không thể lấy danh sách quận/huyện.");
        }
      })
      .catch((error) => {
        setErrorMessage("Đã xảy ra lỗi trong quá trình lấy dữ liệu.");
      });
  };

  // Xử lý thay đổi quận/huyện
  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find(
      (district) => district.full_name === e.target.value
    );
    setDistrict(selectedDistrict);

    fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setWards(data.data);
          setWard("");
        } else {
          setErrorMessage("Không thể lấy danh sách phường/xã.");
        }
      })
      .catch((error) => {
        setErrorMessage("Đã xảy ra lỗi trong quá trình lấy dữ liệu.");
      });
  };

  // Xử lý thay đổi phường/xã
  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  // Kiểm tra quà tặng khi tổng giá thay đổi
  useEffect(() => {
    fetch(`http://localhost:5000/check-gift?finalPrice=${totalPrice}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.gift) {
          setGift(data.gift);
        } else {
          setGift(null);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi kiểm tra quà tặng:", error);
        setErrorMessage("Đã xảy ra lỗi khi kiểm tra quà tặng.");
      });
  }, [totalPrice]);

  // Xử lý submit form thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!useDefaultAddress && (
        !fullName ||
        !phone ||
        !address ||
        !province ||
        !district ||
        !ward
      )) ||
      (useDefaultAddress && cartItems.length === 0)
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        cart: cartItems.map((item) => ({
          book: {
            _id: item._id,
            name: item.name,
            quantity: item.quantity,
            description: item.description,
            images: item.images,
            price: item.price,
            promotion_price: item.promotion_price,
            categories: item.categories,
            promotion_percent: item.promotion_percent || 0,
          },
          quantity: item.cartQuantity,
        })),
        totalPrice: finalPrice + shippingCost,
        address: useDefaultAddress ? user.address : `${address}, ${ward}, ${district.full_name}, ${province.full_name}`,
        paymentMethod,
        discountCode: discountCode ? discountCode.code : null,
        phone,
        userId,
        gift: gift ? gift.gifts : "Không có quà tặng",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      clearCart();
      navigate("/invoice");
    } else {
      setErrorMessage(data.msg || "Đã xảy ra lỗi trong quá trình đặt hàng.");
    }
  };

  // Chọn sử dụng địa chỉ mặc định
  const handleUseDefaultAddress = () => {
    setUseDefaultAddress(true);
  };

  // Chọn sử dụng địa chỉ khác
  const handleUseCustomAddress = () => {
    setUseDefaultAddress(false);
  };

  const finalPrice = discountApplied ? discountedPrice : totalPrice;
  return (
    <div className="relative mx-auto w-full bg-white mt-28">
      <div className="grid min-h-screen grid-cols-10">
        <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
              Chi tiết thanh toán
              <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
            </h1>
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col space-y-4"
            >
              {/* Thêm radiobuttons vào đây */}
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-teal-600 h-5 w-5"
                    checked={useDefaultAddress}
                    onChange={handleUseDefaultAddress}
                  />
                  <span className="ml-2 text-gray-700">Sử dụng thông tin giao hàng mặc định</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-teal-600 h-5 w-5"
                    checked={!useDefaultAddress}
                    onChange={handleUseCustomAddress}
                  />
                  <span className="ml-2 text-gray-700">Sử dụng thông tin giao hàng khác</span>
                </label>
              </div>

              {/* Hiển thị card thông tin giao hàng mặc định nếu được chọn */}
              {useDefaultAddress && (
              <div className="bg-gray-100 p-4 rounded shadow-md">
                <div className="text-xs font-semibold text-gray-500">Thông tin giao hàng mặc định</div>
                <div className="mt-1">
                  <p><span className="font-semibold">Họ tên:</span> {fullName}</p>
                  <p><span className="font-semibold">Số điện thoại:</span> {phone}</p>
                  <p><span className="font-semibold">Địa chỉ:</span> {address}</p>
                </div>
              </div>
            )}
             {!useDefaultAddress && (
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold text-gray-500"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold text-gray-500"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-3">
                <label
                  htmlFor="address"
                  className="text-xs font-semibold text-gray-500"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="province"
                  className="text-xs font-semibold text-gray-500"
                >
                  Tỉnh/Thành phố
                </label>
                <select
                  id="province"
                  name="province"
                  value={province ? province.full_name : ""}
                  onChange={handleProvinceChange}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                >
                  <option disabled hidden value="">
                    Chọn Tỉnh/Thành phố
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.full_name}>
                      {province.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="district"
                  className="text-xs font-semibold text-gray-500"
                >
                  Quận/Huyện
                </label>
                <select
                  id="district"
                  name="district"
                  value={district ? district.full_name : ""}
                  onChange={handleDistrictChange}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                >
                  <option disabled hidden value="">
                    Chọn Quận/Huyện
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.full_name}>
                      {district.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="ward"
                  className="text-xs font-semibold text-gray-500"
                >
                  Phường/Xã
                </label>
                <select
                  id="ward"
                  name="ward"
                  value={ward}
                  onChange={handleWardChange}
                  className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                >
                  <option disabled hidden value="">
                    Chọn Phường/Xã
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.full_name}>
                      {ward.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
              <PaymentMethods
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg"
              >
                Thanh toán
              </button>
            </form>
            {errorMessage && (
              <p className="mt-4 text-center text-sm font-semibold text-red-500">
                {errorMessage}
              </p>
            )}
            <p className="mt-10 text-center text-sm font-semibold text-gray-500">
              Đặt đơn hàng nếu như bạn đồng ý{" "}
              <a
                href="#"
                className="whitespace-nowrap text-teal-400 underline hover:text-teal-600"
              >
                điều khoản và điều kiện
              </a>
            </p>
          </div>
        </div>

        <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
          <div>
            <img
              src="https://images.unsplash.com/photo-1581318694548-0fb6e47fe59b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-800 to-teal-400 opacity-95"></div>
          </div>
          <div className="relative">
                  <ul className="space-y-5">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between">
              <div className="inline-flex">
                <img
                  src={item.images}
                  alt={item.name}
                  className="max-h-16"
                />
                <div className="ml-3">
                  <p className="text-base font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="text-sm font-medium text-white text-opacity-80">
                    Số lượng: {item.cartQuantity}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-white">
                {item.promotion_price} VNĐ
              </p>
            </li>
          ))}
          {gift && (
            <li className="flex justify-between">
              <div className="inline-flex">
                <img
                  src={gift.image}
                  alt={gift.gifts}
                  className="max-h-16"
                />
                <div className="ml-3">
                  <p className="text-base font-semibold text-white">
                    Quà tặng: {gift.gifts}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold text-white">
                Miễn phí
              </p>
            </li>
          )}
        </ul>
            <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
            <div className="space-y-2">
            <p className="flex justify-between text-lg font-bold text-white">
                <span>Phí vận chuyển (ship):</span>
                <span>{shippingCost} VNĐ</span>
              </p>
              <p className="flex justify-between text-lg font-bold text-white">
                <span>Tổng cộng:</span>
                <span>{totalPrice + shippingCost} đ</span>
              </p>
              <p className="flex justify-between text-sm font-medium text-white">
                <span>Đã áp dụng mã giảm:</span>
                <span>
                  {discountApplied
                    ? `${discountedPrice - totalPrice} đ`
                    : "Không có"}
                </span>
              </p>
              <p className="flex justify-between text-lg font-bold text-white">
                <span>Giá sau giảm:</span>
                <span>{finalPrice + shippingCost}đ</span>
              </p>
            </div>
            
          </div>
          
          <div className="relative mt-10 text-white">
            <h3 className="mb-5 text-lg font-bold">Hỗ trợ</h3>
            <p className="text-sm font-semibold">
              +84 343 899 504{" "}
              <span className="font-light">(Quản trị viên)</span>
            </p>
            <p className="mt-1 text-sm font-semibold">
              tranahuy247@gmail.com <span className="font-light">(Email)</span>
            </p>
            <p className="mt-2 text-xs font-medium">
              Hãy gọi ngay cho chúng tôi nếu có vấn đề liên quan đến thanh toán
            </p>
          </div>
          
        </div>
        
      </div>
      
    </div>
  );
};

export default Checkout;