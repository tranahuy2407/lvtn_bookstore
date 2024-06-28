import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/addcategories', {
        name,
        description,
        image,
      });
      setMessage('Thêm thể loại thành công!');
      setName('');
      setDescription('');
      setImage('');
      setTimeout(() => {
        navigate('/admin/dashboard/categories');
      }, 1500); // Chờ 1.5 giây trước khi điều hướng
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm thể loại');
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Thêm thể loại</strong>
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
          <label htmlFor='image' className='block text-gray-700 text-sm font-bold mb-2'>
            Hình ảnh URL
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
          Thêm
        </button>
        {message && <p className='mt-3 text-green-500'>{message}</p>}
      </form>
    </div>
  );
};

export default AddCategory;