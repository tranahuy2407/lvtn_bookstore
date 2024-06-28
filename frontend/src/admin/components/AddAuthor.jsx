import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddAuthor() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/addauthors', {
        name,
        description,
        image
      });

    
      setMessage(response.data.message);
      setName('');
      setDescription('');
      setImage('');
      
      // Điều hướng về trang danh sách tác giả sau khi thêm thành công
      setTimeout(() => {
        navigate('/admin/dashboard/authors');
      }, 1000);
    } catch (error) {
      setMessage('Thêm không thành công');
      console.error('Error adding author:', error);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Thêm tác giả</strong>
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-4 flex items-center'>
          <label className='block text-gray-700 text-sm font-bold mb-2 w-1/4' htmlFor='name'>
            Tên tác giả
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4 flex items-center'>
          <label className='block text-gray-700 text-sm font-bold mb-2 w-1/4' htmlFor='description'>
            Mô tả
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10'
           
          />
        </div>
        <div className='mb-4 flex items-center'>
          <label className='block text-gray-700 text-sm font-bold mb-2 w-1/4' htmlFor='image'>
            Hình ảnh
          </label>
          <input
            type='text'
            id='image'
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className='shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Thêm
        </button>
        {message && <p className='mt-3 text-green-500'>{message}</p>}
        {error && <p className='mt-3 text-red-500'>{error}</p>}
      </form>
    </div>
  );
}

export default AddAuthor;