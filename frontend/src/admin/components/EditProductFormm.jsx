import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, InputNumber, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

function EditProductForm({ product, onClose }) {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";

  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(product.promotion_percent || 0);
  const [uploading, setUploading] = useState(false); 

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

  useEffect(() => {
    const calculatePromotionPrice = () => {
      const price = updatedProduct.price || 0;
      const discount = discountPercentage || 0;
      const promotionPrice = price - (price * discount) / 100;
      setUpdatedProduct({ ...updatedProduct, promotion_price: promotionPrice });
    };

    calculatePromotionPrice();
  }, [updatedProduct.price, discountPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setUpdatedProduct({ ...updatedProduct, categories: value });
  };

  const handleAuthorChange = (value) => {
    setUpdatedProduct({ ...updatedProduct, author: value });
  };

  const handlePublisherChange = (value) => {
    setUpdatedProduct({ ...updatedProduct, publishers: value });
  };

  const handlePriceChange = (value) => {
    setUpdatedProduct({ ...updatedProduct, price: value });
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(value);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `Sách/${product.name}`);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = response.data.secure_url;
      setUpdatedProduct({ ...updatedProduct, images: imageUrl });
      setImageName(file.name);
      message.success('Tải lên hình ảnh thành công!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Tải lên hình ảnh thất bại.');
    }
  };

  const handleUpdateProduct = async () => {
    setUploading(true); 
    try {
      await axios.put(`http://localhost:5000/admin/update-product/${updatedProduct._id}`, {
        ...updatedProduct,
        promotion_percent: discountPercentage,
        images: updatedProduct.images || null,
      });
      message.success('Cập nhật sản phẩm thành công!');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error.response || error.message);
      message.error('Cập nhật sản phẩm thất bại.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-md shadow-lg">
      <h2 className="text-lg font-medium mb-4">Chỉnh sửa sản phẩm</h2>
      <Form layout="vertical">
        <Form.Item label="Tên sản phẩm">
          <Input name="name" value={updatedProduct.name} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Mô tả">
          <Input.TextArea name="description" value={updatedProduct.description} onChange={handleChange} />
        </Form.Item>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item label="Giá gốc" style={{ flex: 1 }}>
            <InputNumber value={updatedProduct.price} onChange={handlePriceChange} />
          </Form.Item>
          <Form.Item label="Phần trăm giảm giá" style={{ flex: 1 }}>
            <InputNumber
              min={0}
              max={100}
              value={updatedProduct.promotion_percent}
              onChange={handleDiscountPercentageChange}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          </Form.Item>
          <Form.Item label="Giá khuyến mãi" style={{ flex: 1 }}>
            <InputNumber value={updatedProduct.promotion_price} readOnly />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item label="Tác giả" style={{ flex: 1 }}>
            <Select
              value={updatedProduct.author}
              onChange={handleAuthorChange}
              style={{ width: '100%' }}
            >
              {authors.map((author) => (
                <Option key={author._id} value={author._id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Nhà xuất bản" style={{ flex: 1 }}>
            <Select
              value={updatedProduct.publishers}
              onChange={handlePublisherChange}
              style={{ width: '100%' }}
            >
              {publishers.map((publisher) => (
                <Option key={publisher._id} value={publisher._id}>
                  {publisher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item label="Danh mục">
          <Select
            mode="multiple"
            value={updatedProduct.categories}
            onChange={handleCategoryChange}
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          {imageName && <p>File đã tải lên: {imageName}</p>}
          {updatedProduct.images && <img src={updatedProduct.images} alt="Product" className="mt-2 w-32 h-32 object-contain" />}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleUpdateProduct} loading={uploading}>
            Lưu thay đổi
          </Button>
          <Button type="default" onClick={onClose} className="ml-2">
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditProductForm;
