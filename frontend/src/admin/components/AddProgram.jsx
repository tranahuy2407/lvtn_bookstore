import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { Option } = Select;

const AddProgram = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotions, setSelectedPromotions] = useState([]);

  const UPLOAD_PRESET = 'yznfezyj';
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload';

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promotions'); 
        setPromotions(response.data.promotions); 
      } catch (error) {
        console.error('Error fetching promotions:', error);
        messageApi.error('Failed to fetch promotions.');
      }
    };

    fetchPromotions();
  }, []);

  const handleAddProgram = async (values) => {
    setUploading(true);
    try {
      let imageUrl = null;
  
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'Chương trình khuyến mãi');
  
        const response = await axios.post(CLOUDINARY_URL, formData, { 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: false,
        });
  
        imageUrl = response.data.secure_url;
      }
  
      const newProgram = { ...values, image: imageUrl, promotions: selectedPromotions };
      await axios.post('http://localhost:5000/programs', newProgram); 
      messageApi.success('Chương trình đã được thêm thành công');
      form.resetFields();
      setImageFile(null);
      setImageName('');
      setSelectedPromotions([]);
      navigate('/admin/dashboard/program');
    } catch (error) {
      console.error('Lỗi khi thêm chương trình:', error);
      messageApi.error('Lỗi khi thêm chương trình');
    } finally {
      setUploading(false);
    }
  };
  

  const handleUploadImage = (file) => {
    if (!file.type.startsWith('image/')) {
      messageApi.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
      return false;
    }
    setImageFile(file);
    setImageName(file.name);
    return false; 
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    form.setFieldsValue({ description: data });
  };

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg'>
      {contextHolder}
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Thêm Chương Trình Khuyến Mãi</h2>
      <Form form={form} onFinish={handleAddProgram} layout='vertical'>
        <Form.Item label='Tên' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Mô tả'
          name='description'
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <div className="ckeditor-container">
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: [
                  'undo', 'redo', '|',
                  'heading', '|', 'bold', 'italic', '|',
                  'link', 'insertTable', 'mediaEmbed', '|',
                  'bulletedList', 'numberedList', 'indent', 'outdent'
                ],
                initialData: form.getFieldValue('description') || '<p>Nhập mô tả tại đây...</p>',
              }}
              onChange={handleEditorChange}
            />
          </div>
        </Form.Item>
        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select placeholder='Chọn trạng thái'>
            <Option value={1}>Hiển thị</Option>
            <Option value={0}>Ẩn</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Mã khuyến mãi' name='promotions'>
          <Select
            mode='multiple'
            placeholder='Chọn mã khuyến mãi'
            className='w-full'
            onChange={(value) => setSelectedPromotions(value)}
            value={selectedPromotions}
          >
            {promotions.map(promotion => (
              <Option key={promotion._id} value={promotion._id}>
                {promotion.code} - {promotion.description}
              </Option>
            ))}
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
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full' loading={uploading}>
            Thêm chương trình
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProgram;
