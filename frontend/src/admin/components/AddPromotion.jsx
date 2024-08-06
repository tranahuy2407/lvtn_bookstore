import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Row, Col, Upload, Select, DatePicker, Dropdown, Menu } from 'antd';
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const AddPromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  const UPLOAD_PRESET = 'yznfezyj';
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        messageApi.error('Failed to fetch books.');
      }
    };
    fetchBooks();
  }, []);

  const handleAddPromotion = async (values) => {
    setUploading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'Khuyến mãi');

        const response = await axios.post(CLOUDINARY_URL, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        });

        imageUrl = response.data.secure_url;
      }

      const status = values.status === 'Hiển thị' ? 1 : 0;

      const newPromotion = { ...values, image: imageUrl, status, books: selectedBooks };
      await axios.post('http://localhost:5000/api/addpromotion', newPromotion);
      messageApi.success('Promotion added successfully');
      form.resetFields();
      setImageFile(null);
      setImageName('');
      setSelectedBooks([]);
      navigate('/admin/dashboard/promotions');
    } catch (error) {
      console.error('Error adding promotion:', error);
      messageApi.error('Error adding promotion');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadImage = (file) => {
    if (!file.type.startsWith('image/')) {
      messageApi.error('Bạn chỉ có thể tải lên hình ảnh!');
      return false;
    }
    setImageFile(file);
    setImageName(file.name);
    return false; 
  };

  const handleDateChange = (date, dateString) => {
    const startDate = form.getFieldValue('start_day');
    if (dateString && startDate && dateString < startDate) {
      messageApi.error('Ngày kết thúc phải chọn sau ngày bắt đầu');
      form.setFieldsValue({ end_day: '' });
    }
  };

  const handleBooksChange = (values) => {
    setSelectedBooks(values);
  };

  const handleSelectAll = () => {
    setSelectedBooks(books.map(book => book._id));
  };

  const handleDeselectAll = () => {
    setSelectedBooks([]);
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={handleSelectAll}>Chọn tất cả</Menu.Item>
      <Menu.Item onClick={handleDeselectAll}>Bỏ chọn tất cả</Menu.Item>
    </Menu>
  );

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg'>
      {contextHolder}
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Thêm Mã Khuyến Mãi</h2>
      <Form form={form} onFinish={handleAddPromotion} layout='vertical'>
        <Form.Item label='Mô tả' name='description' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select placeholder='Chọn trạng thái'>
            <Option value='Hiển thị'>Hiển thị</Option>
            <Option value='Ẩn'>Ẩn</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Hình ảnh' name='image'>
          <Upload
            beforeUpload={handleUploadImage}
            showUploadList={false}
            maxCount={1}
            className='mt-1 block w-full'
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          {imageName && <span style={{ marginLeft: 8 }}>Hình ảnh đã chọn: {imageName}</span>}
        </Form.Item>
        <Form.Item label='Loại' name='type' rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
          <Select placeholder='Chọn loại'>
            <Option value='percent'>Giảm phần trăm</Option>
            <Option value='money'>Giảm tiền</Option>
            <Option value='ship'>Miễn phí vận chuyển</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Mã' name='code' rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label='Giá trị' name='value' rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
              <Input type='number' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Điều kiện' name='conditional' rules={[{ required: true, message: 'Vui lòng nhập điều kiện' }]}>
              <Input type='number' />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label='Giới hạn' name='limit' rules={[{ required: true, message: 'Vui lòng nhập giới hạn' }]}>
              <Input type='number' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Ngày bắt đầu'
              name='start_day'
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                defaultValue={dayjs()}
                format='DD/MM/YYYY'
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Ngày kết thúc'
              name='end_day'
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format='DD/MM/YYYY'
                onChange={handleDateChange}
                disabledDate={(current) => current && current <= form.getFieldValue('start_day')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Sách áp dụng'>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Button>
              Chọn sách <DownOutlined />
            </Button>
          </Dropdown>
          <Select
            mode='multiple'
            placeholder='Chọn sách'
            value={selectedBooks}
            onChange={handleBooksChange}
            style={{ width: '100%', marginTop: 8 }}
          >
            {books.map(book => (
              <Option key={book._id} value={book._id}>
                {book.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full' loading={uploading}>
            Thêm mã khuyến mãi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPromotion;
