import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Favourites from '../components/Favourites';
import OrderMe from '../components/OrderMe';

const AccountPage = () => {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, clearUser, setUser } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
      });
    }
  }, [user]);

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
          setDistrict(null);
        } else {
          setErrorMessage("Không thể lấy danh sách quận/huyện.");
        }
      })
      .catch((error) => {
        setErrorMessage("Đã xảy ra lỗi trong quá trình lấy dữ liệu.");
      });
  };

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
          setWard(null);
        } else {
          setErrorMessage("Không thể lấy danh sách phường/xã.");
        }
      })
      .catch((error) => {
        setErrorMessage("Đã xảy ra lỗi trong quá trình lấy dữ liệu.");
      });
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        address: `${formData.address}, ${ward}, ${district.full_name}, ${province.full_name}`
      };
      const response = await axios.post('http://localhost:5000/api/updateProfile', dataToSend);
      setUser(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleEditClick = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
    });
    setEditing(true);
  };

  const dangXuat = async () => {
    await axios.post('http://localhost:5000/logout');
    clearUser();
    setRedirect('/');
  };

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  const linkClasses = (type = null) => {
    let classes = 'py-2 px-6';
    if (type === subpage) {
      classes += ' bg-primary text-white rounded-full';
    }
    return classes;
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const getAddressUntilFirstComma = () => {
    if (formData.address) {
      const index = formData.address.indexOf(',');
      if (index !== -1) {
        return formData.address.slice(0, index);
      } else {
        return formData.address;
      }
    }
    return '';
  };

  return (
    <div>
      <nav className="w-full flex justify-center mt-24 gap-2 mb-8">
        {user && (
          <>
            <Link className={linkClasses('profile')} to="/account">Hồ sơ của bạn</Link>
            <Link className={linkClasses('favoritebooks')} to="/account/favoritebooks">Sách bạn đã yêu thích</Link>
            <Link className={linkClasses('myorders')} to="/account/myorders">Đơn hàng của bạn</Link>
          </>
        )}
      </nav>
      {user && subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">Tên:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block mb-1">Số điện thoại:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4 flex gap-4">
                <div className="w-1/3">
                  <label htmlFor="province" className="block mb-1">Tỉnh/thành phố:</label>
                  <select
                    id="province"
                    name="province"
                    value={province ? province.full_name : ""}
                    onChange={handleProvinceChange}
                    className="border p-2 w-full"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.full_name}>{province.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label htmlFor="district" className="block mb-1">Quận/huyện:</label>
                  <select
                    id="district"
                    name="district"
                    value={district ? district.full_name : ""}
                    onChange={handleDistrictChange}
                    className="border p-2 w-full"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.full_name}>{district.full_name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label htmlFor="ward" className="block mb-1">Phường/xã:</label>
                  <select
                    id="ward"
                    name="ward"
                    value={ward ? ward.full_name : ""}
                    onChange={handleWardChange}
                    className="border p-2 w-full"
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.full_name}>{ward.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block mb-1">Địa chỉ cụ thể:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={getAddressUntilFirstComma()}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <button type="submit" className="bg-green-500 text-white font-semibold py-2 px-4 rounded mr-4">Lưu</button>
              <button type="button" className="bg-red-500 text-white font-semibold py-2 px-4 rounded" onClick={() => setEditing(false)}>Hủy</button>
            </form>
          ) : (
            <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
              <div>
                <p className="font-semibold mb-2">Tên: {user.name}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">Số điện thoại: {user.phone}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">Email: {user.email}</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2">Địa chỉ: {user.address}</p>
              </div>
              <button onClick={handleEditClick} className="mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded">Chỉnh sửa thông tin cá nhân</button>
            </div>
          )}
          <br />
          <button onClick={dangXuat} className="max-w-sm mt-2" id="login">Đăng xuất</button>
        </div>
       )}
       {user && subpage === 'favoritebooks' && (
        <Favourites/>
       )}
        {user && subpage === 'myorders' && (
        <OrderMe/>
       )}
    </div>
  );
};

export default AccountPage;

