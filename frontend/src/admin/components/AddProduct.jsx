import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox } from 'antd';

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: '',
    quantity: '',
    price: '',
    categories: [], // Updated to store selected categories
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]); // State to hold categories from API

  useEffect(() => {
    // Fetch categories from API when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    // Handle changes in input fields
    if (e.target.name === 'categories') {
      // Handle changes in checkbox group (categories)
      setProduct({ ...product, categories: e });
    } else {
      // Handle changes in other input fields
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/add-product', product, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage('Sản phẩm đã được thêm thành công!');
      setErrorMessage('');
      // Clear the form
      setProduct({
        name: '',
        description: '',
        images: '',
        quantity: '',
        price: '',
        categories: [],
      });
    } catch (error) {
      setErrorMessage('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.');
      setSuccessMessage('');
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-white px-8 pt-6 pb-8 rounded-md shadow-md'>
      <strong className='text-gray-700 text-xl font-medium block mb-4'>Thêm sản phẩm mới</strong>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-gray-700'>Tên sản phẩm</label>
            <input
              type='text'
              name='name'
              value={product.name}
              onChange={handleChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Giá</label>
            <input
              type='number'
              name='price'
              value={product.price}
              onChange={handleChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Hình ảnh (URL)</label>
            <input
              type='text'
              name='images'
              value={product.images}
              onChange={handleChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Số lượng</label>
            <input
              type='number'
              name='quantity'
              value={product.quantity}
              onChange={handleChange}
              className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Thể loại</label>
            <Checkbox.Group
              options={categories.map(category => ({
                label: category.name,
                value: category._id,
              }))}
              name='categories'
              value={product.categories}
              onChange={handleChange}
              className='mt-1 block w-full'
              required
            />
          </div>
        </div>
        <div>
          <label className='block text-gray-700'>Mô tả</label>
          <textarea
            name='description'
            value={product.description}
            onChange={handleChange}
            className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Thêm sản phẩm
        </button>
      </form>
      {successMessage && <p className='mt-4 text-green-500'>{successMessage}</p>}
      {errorMessage && <p className='mt-4 text-red-500'>{errorMessage}</p>}
    </div>
  );
}