import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, message, DatePicker, InputNumber, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditPromotionForm = ({ promotion, onClose, onUpdatePromotion }) => {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";

  const [updatedPromotion, setUpdatedPromotion] = useState(promotion);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setUpdatedPromotion(promotion);
    setImageUrl(promotion.image || '');
    if (promotion.image) {
      setImageName(promotion.image.split('/').pop());
    }
    // Fetch books data
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        message.error('Failed to fetch books.');
      }
    };
    fetchBooks();
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPromotion(prev => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (name, value) => {
    setUpdatedPromotion(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "Khuyến mãi");

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false
      });

      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error(`Tải lên hình ảnh thất bại: ${error.message}`);
      return null;
    }
  };

  const handleUpdatePromotion = async () => {
    setUploading(true);
    
    try {
      let uploadedImageUrl = imageUrl;

      if (imageFile) {
        uploadedImageUrl = await handleUploadImage(imageFile);
        if (!uploadedImageUrl) {
          setUploading(false);
          return;
        }
      }

      const response = await axios.put(`http://localhost:5000/api/updatepromotion/${updatedPromotion._id}`, {
        ...updatedPromotion,
        image: uploadedImageUrl || null,
      });

      message.success('Cập nhật khuyến mãi thành công!');
      onUpdatePromotion(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating promotion:', error);
      message.error('Cập nhật khuyến mãi thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (info) => {
    const { file } = info;
    if (file.status === 'done') {
      setImageFile(file.originFileObj);
      setImageName(file.name);
      setImageUrl(URL.createObjectURL(file.originFileObj));
    } else if (file.status === 'error') {
      setImageFile(null);
      setImageName('');
      setImageUrl('');
    }
  };

  const handleEndDateChange = (date, dateString) => {
    const startDate = updatedPromotion.start_day;
    if (dateString && startDate && dateString < startDate) {
      message.error('Ngày kết thúc phải chọn sau ngày bắt đầu');
      setUpdatedPromotion(prev => ({ ...prev, end_day: null }));
    } else {
      setUpdatedPromotion(prev => ({ ...prev, end_day: date ? date.toISOString() : null }));
    }
  };

  const handleBooksChange = (values) => {
    if (values.includes('select_all')) {
      setUpdatedPromotion(prev => ({ ...prev, books: books.map(book => book._id) }));
    } else if (values.includes('deselect_all')) {
      setUpdatedPromotion(prev => ({ ...prev, books: [] }));
    } else {
      setUpdatedPromotion(prev => ({ ...prev, books: values }));
    }
  };

  const isAllSelected = updatedPromotion.books.length === books.length;

  return (
    <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl mx-auto">
      <h2 className="text-lg font-medium mb-4">Chỉnh sửa khuyến mãi</h2>
      <Form layout="vertical">
        <Form.Item label="Mô tả">
          <Input name="description" value={updatedPromotion.description} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Loại">
          <Input name="type" value={updatedPromotion.type} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Mã">
          <Input name="code" value={updatedPromotion.code} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Giá trị">
          <InputNumber
            name="value"
            value={updatedPromotion.value}
            onChange={(value) => handleValueChange('value', value)}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <div className="flex space-x-4">
          <Form.Item label="Ngày bắt đầu" className="flex-1">
            <DatePicker
              value={updatedPromotion.start_day ? moment(updatedPromotion.start_day) : null}
              onChange={(date) => handleValueChange('start_day', date ? date.toISOString() : null)}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" className="flex-1">
            <DatePicker
              value={updatedPromotion.end_day ? moment(updatedPromotion.end_day) : null}
              onChange={handleEndDateChange}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current <= moment(updatedPromotion.start_day)}
            />
          </Form.Item>
        </div>
        <Form.Item label="Sách áp dụng">
          <Select
            mode="multiple"
            placeholder="Chọn sách"
            value={updatedPromotion.books}
            onChange={handleBooksChange}
            style={{ width: '100%' }}
          >
            <Option key="select_all" value="select_all">
              Chọn tất cả
            </Option>
            <Option key="deselect_all" value="deselect_all">
              Bỏ chọn tất cả
            </Option>
            {books.map(book => (
              <Option key={book._id} value={book._id}>
                {book.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            beforeUpload={(file) => {
              setImageFile(file);
              setImageName(file.name);
              return false; 
            }}
            onChange={handleImageChange}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          {imageName && <p className="mt-2 text-gray-500">File đã tải lên: {imageName}</p>}
          {imageUrl && <img src={imageUrl} alt="Promotion" className="mt-2 w-32 h-32 object-contain" />}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleUpdatePromotion}
            disabled={uploading}
          >
            {uploading ? 'Đang tải lên...' : 'Lưu thay đổi'}
          </Button>
          <Button type="default" onClick={onClose} className="ml-2">
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPromotionForm;
