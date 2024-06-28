import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promotions');
        console.log(response.data)
        if (Array.isArray(response.data)) {
          setPromotions(response.data);
        } else {
          console.error('Invalid promotions data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setError('Lỗi khi tải danh sách khuyến mãi');
      }
    };  

    fetchPromotions();
  }, []);

  const handleAddPromotion = () => {
    navigate('/admin/dashboard/addpromotion');
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách khuyến mãi</strong>
      {message && <div className="text-green-500 mt-2">{message}</div>}
      <div className="mt-4 flex justify-start">
                <button
                    onClick={handleAddPromotion}
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Thêm mã khuyến mãi
                </button>
            </div>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-2 px-4">ID</th>
            <th className="border border-gray-300 py-2 px-4">Mô tả</th>
            <th className="border border-gray-300 py-2 px-4">Loại</th>
            <th className="border border-gray-300 py-2 px-4">Mã</th>
            <th className="border border-gray-300 py-2 px-4">Giá trị</th>
            <th className="border border-gray-300 py-2 px-4">Ngày bắt đầu</th>
            <th className="border border-gray-300 py-2 px-4">Ngày kết thúc</th>
            <th className="border border-gray-300 py-2 px-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo._id}>
              <td className="border border-gray-300 py-2 px-4">{promo._id}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.description}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.type}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.code}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.value}</td>
              <td className="border border-gray-300 py-2 px-4">{new Date(promo.start_day).toLocaleDateString()}</td>
              <td className="border border-gray-300 py-2 px-4">{new Date(promo.end_day).toLocaleDateString()}</td>
              <td className="border border-gray-300 py-2 px-4">
                                    <Link
                                        to={`path/${promo._id}`} // Ensure the URL includes the id parameter
                                        className='text-blue-500 mr-2'
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(promo._id)}
                                        className='text-red-500'
                                    >
                                        Xóa
                                    </button>
                                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Promotions;