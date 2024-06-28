import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCategory = () => {
  const { categoryId } = useParams(); 
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories/${categoryId}`);
        const { name, description, image } = response.data;
        setName(name);
        setDescription(description);
        setImage(image);
      } catch (error) {
        setError('Không thể tải thông tin thể loại');
        console.error('Lỗi khi fetch thể loại:', error);
      }
    };

    fetchCategory();
  }, [categoryId]); // useEffect sẽ chạy lại khi categoryId thay đổi

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/categories/${categoryId}`, {
        name,
        description,
        image
      });
      setMessage('Cập nhật thể loại thành công!');
      setTimeout(() => {
        navigate('/admin/dashboard/categories'); // Chuyển hướng về trang danh sách thể loại sau khi cập nhật thành công
      }, 1500); // Đợi 1.5 giây trước khi chuyển hướng
    } catch (error) {
      setMessage('Có lỗi xảy ra khi cập nhật thể loại.');
      console.error('Lỗi khi cập nhật thể loại:', error);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Cập nhật thể loại</strong>
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Tên thể loại
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='description'>
            Mô tả
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='image'>
            Hình ảnh
          </label>
          <input
            type='text'
            id='image'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Cập nhật
        </button>
        {message && <p className='mt-3 text-green-500'>{message}</p>}
        {error && <p className='mt-3 text-red-500'>{error}</p>}
      </form>
    </div>
  );
};

export default UpdateCategory;