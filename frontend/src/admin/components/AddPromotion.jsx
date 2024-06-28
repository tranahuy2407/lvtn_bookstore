import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddPromotion() {
  const [formData, setFormData] = useState({
    description: '',
    image: '',
    type: '',
    code: '',
    value: '',
    conditional: '',
    limit: '',
    start_day: '',
    end_day: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/promotion/add', formData);
      console.log(response.data);
      setMessage('Promotion added successfully');
      setFormData({
        description: '',
        image: '',
        type: '',
        code: '',
        value: '',
        conditional: '',
        limit: '',
        start_day: '',
        end_day: '',
      });
      navigate('/promotions'); // Redirect to promotions list page
    } catch (error) {
      console.error('Error adding promotion:', error);
      setError('Error adding promotion');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Thêm Mã Khuyến Mãi</h2>
      {message && <div className="text-green-500 mb-4">{message}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleAddPromotion} className=''>
        <div className="mb-4">
          <label className="block text-gray-700">Mô tả</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">URL Hình ảnh</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Loại</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mã</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giá trị</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Điều kiện</label>
          <input
            type="number"
            name="conditional"
            value={formData.conditional}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Giới hạn</label>
          <input
            type="number"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ngày bắt đầu</label>
          <input
            type="date"
            name="start_day"
            value={formData.start_day}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ngày kết thúc</label>
          <input
            type="date"
            name="end_day"
            value={formData.end_day}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
          Thêm mã khuyến mãi
        </button>
      </form>
    </div>
  );
}

export default AddPromotion;