import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Button, InputNumber, Input, Select, message, Modal } from 'antd';
import { UploadOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddProduct = () => {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: '',
    quantity: 0,
    price: '',
    promotion_percent: 0,
    promotion_price: 0,
    categories: [],
    author: '',
    publishers: '',
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [messageInfo, setMessageInfo] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, authorsRes, publishersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/authors'),
          axios.get('http://localhost:5000/api/publishers'),
        ]);
        setCategories(categoriesRes.data);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categories') {
      setProduct({ ...product, categories: value });
    } else {
      setProduct({ ...product, [name]: value });
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

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `Sách/${product.name}`);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
      });

      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      message.error(`Image upload failed: ${error.message}`);
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
  
    if (!product.name || !product.price || !product.categories.length || !product.author || !product.publishers) {
      message.error('Please fill in all required fields.');
      setUploading(false);
      return;
    }
  
    try {
      let imageUrl = product.images;
  
      if (imageFile) {
        imageUrl = await handleUploadImage(imageFile);
        if (!imageUrl) {
          setUploading(false);
          return;
        }
      }
  
      await axios.post('http://localhost:5000/admin/add-product', {
        ...product,
        images: imageUrl,
        price: Number(product.price),
        quantity: Number(product.quantity),
        promotion_price: Number(product.promotion_price),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setMessageInfo('Product added successfully!');
      setProduct({
        name: '',
        description: '',
        images: '',
        quantity: 0,
        price: '',
        promotion_percent: 0,
        promotion_price: 0,
        categories: [],
        author: '',
        publishers: '',
      });
      setImageFile(null);
      setImageName('');
      setTimeout(() => navigate('/admin/dashboard/products'), 1500);
    } catch (error) {
      setMessageInfo('Error adding product. Please try again.');
      console.error('Error adding product:', error.response ? error.response.data : error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn hủy bỏ?',
      content: 'Những thay đổi của bạn sẽ không được lưu.',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => navigate('/admin/dashboard/products'),
    });
  };

  return (
    <div className='max-w-4xl mx-auto bg-white px-8 pt-6 pb-8 rounded-md shadow-md'>
      <strong className='text-gray-700 text-xl font-medium block mb-4'>Thêm Sản Phẩm Mới</strong>
      <div className='space-y-4 overflow-y-auto' style={{ maxHeight: '700px' }}>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-gray-700'>Tên Sản Phẩm</label>
            <Input
              name='name'
              value={product.name}
              onChange={handleChange}
              className='mt-1 block w-full'
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
            <label className='block text-gray-700'>Phần Trăm Giảm Giá</label>
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
            <label className='block text-gray-700'>Giá Sau Giảm Giá</label>
            <InputNumber
              name='promotion_price'
              value={product.promotion_price}
              disabled
              className='mt-1 block w-full'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Hình Ảnh</label>
            <Upload
              beforeUpload={(file) => {
                setImageFile(file);
                setImageName(file.name);
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {imageName && <span style={{ marginLeft: 8 }}>{imageName}</span>}
          </div>
          <div>
            <label className='block text-gray-700'>Số Lượng</label>
            <InputNumber
              name='quantity'
              value={product.quantity}
              onChange={(value) => setProduct({ ...product, quantity: value })}
              className='mt-1 block w-full'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Mô Tả</label>
            <Input.TextArea
              name='description'
              value={product.description}
              onChange={handleChange}
              rows={4}
              className='mt-1 block w-full'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Danh Mục</label>
            <Select
              mode='multiple'
              name='categories'
              value={product.categories}
              onChange={(value) => handleSelectChange(value, 'categories')}
              className='mt-1 block w-full'
            >
              {categories.map(category => (
                <Option key={category._id} value={category._id}>{category.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <label className='block text-gray-700'>Tác Giả</label>
            <Select
              name='author'
              value={product.author}
              onChange={(value) => handleSelectChange(value, 'author')}
              className='mt-1 block w-full'
            >
              {authors.map(author => (
                <Option key={author._id} value={author._id}>{author.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <label className='block text-gray-700'>Nhà Xuất Bản</label>
            <Select
              name='publishers'
              value={product.publishers}
              onChange={(value) => handleSelectChange(value, 'publishers')}
              className='mt-1 block w-full'
            >
              {publishers.map(publisher => (
                <Option key={publisher._id} value={publisher._id}>{publisher.name}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className='flex justify-end mt-6'>
        <Button
          type='default'
          onClick={handleCancel}
          className='flex items-center justify-center'
          style={{ marginRight: '8px' }}
        >
          <CloseOutlined />
        </Button>
        <Button
          type='primary'
          onClick={handleSubmit}
          className='flex items-center justify-center'
          icon={<SaveOutlined />}
          loading={uploading}
        >
          Lưu
        </Button>
      </div>
      {messageInfo && <p className='mt-4 text-center text-red-600'>{messageInfo}</p>}
    </div>
  );
};

export default AddProduct;
  