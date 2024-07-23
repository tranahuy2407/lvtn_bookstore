import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox, Select, InputNumber, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function AddProduct() {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";

  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: '',
    price: '',
    promotion_percent: 0,
    promotion_price: 0,
    categories: [],
    author: '',
    publishers: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    const fetchPublishers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/publishers');
        setPublishers(response.data);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    };

    fetchCategories();
    fetchAuthors();
    fetchPublishers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'categories') {
      setProduct({ ...product, categories: e });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (value, field) => {
    setProduct({ ...product, [field]: value });
  };

  const handlePromotionChange = (value) => {
    const promotionPrice = product.price - (product.price * value / 100);
    setProduct({
      ...product,
      promotion_percent: value,
      promotion_price: promotionPrice,
    });
  };

  const handlePriceChange = (value) => {
    const promotionPrice = value - (value * product.promotion_percent / 100);
    setProduct({
      ...product,
      price: value,
      promotion_price: promotionPrice,
    });
  };

  const handleUploadImage = async ({ file }) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Bạn chỉ có thể tải lên hình ảnh!");
      return false;
    }
    setImageFile(file);
    setImageName(file.name);
    return false; // Prevent auto upload by Ant Design
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = product.images;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = response.data.secure_url;
      }

      const newProduct = { ...product, images: imageUrl };
      const response = await axios.post('http://localhost:5000/admin/add-product', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccessMessage('Sản phẩm đã được thêm thành công!');
      setErrorMessage('');
      setProduct({
        name: '',
        description: '',
        images: '',
        price: '',
        promotion_percent: 0,
        promotion_price: 0,
        categories: [],
        author: '',
        publishers: '',
      });
      setImageFile(null);
      setImageName('');
    } catch (error) {
      setErrorMessage('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.');
      setSuccessMessage('');
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-white px-8 pt-6 pb-8 rounded-md shadow-md'>
      <strong className='text-gray-700 text-xl font-medium block mb-4'>Thêm sản phẩm mới</strong>
      <form onSubmit={handleSubmit} className='space-y-4 overflow-y-auto' style={{ maxHeight: '500px' }}>
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
            <InputNumber
              name='price'
              value={product.price}
              onChange={handlePriceChange}
              className='mt-1 block w-full'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Phần trăm giảm giá</label>
            <InputNumber
              name='promotion_percent'
              value={product.promotion_percent}
              onChange={handlePromotionChange}
              min={0}
              max={100}
              className='mt-1 block w-full'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Giá sau khi giảm</label>
            <InputNumber
              name='promotion_price'
              value={product.promotion_price}
              disabled
              className='mt-1 block w-full'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Hình ảnh</label>
            <Upload
              name='images'
              listType='picture'
              className='mt-1 block w-full'
              showUploadList={false}
              beforeUpload={handleUploadImage}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
            {imageName && <span style={{ marginLeft: 8 }}>{imageName}</span>}
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
              onChange={(values) => handleSelectChange(values, 'categories')}
              className='mt-1 block w-full'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Tác giả</label>
            <Select
              name='author'
              value={product.author}
              onChange={(value) => handleSelectChange(value, 'author')}
              className='mt-1 block w-full'
              required
            >
              {authors.map(author => (
                <Option key={author._id} value={author._id}>{author.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <label className='block text-gray-700'>Nhà xuất bản</label>
            <Select
              name='publishers'
              value={product.publishers}
              onChange={(value) => handleSelectChange(value, 'publishers')}
              className='mt-1 block w-full'
              required
            >
              {publishers.map(publisher => (
                <Option key={publisher._id} value={publisher._id}>{publisher.name}</Option>
              ))}
            </Select>
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
        <div>
          <Button type='primary' htmlType='submit'>
            Thêm sản phẩm
          </Button>
        </div>
      </form>
      {successMessage && <p className='text-green-500'>{successMessage}</p>}
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </div>
  );
}
