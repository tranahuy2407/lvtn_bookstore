import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { Option } = Select;

const EditProgramForm = ({ program, onClose, onUpdateProgram }) => {
  const [form] = Form.useForm(); 
  const [image, setImage] = useState(program.image);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotions, setSelectedPromotions] = useState(program.promotions.map(promo => promo._id) || []);
  const [uploading, setUploading] = useState(false);

  const UPLOAD_PRESET = 'yznfezyj';
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload';

  useEffect(() => {
    form.setFieldsValue({
      name: program.name,
      description: program.description,
      status: program.status,
      promotions: selectedPromotions 
    });
    setImage(program.image);
    fetchPromotions();
  }, [program, form, selectedPromotions]);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/promotions');
      setPromotions(response.data.promotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      message.error('Failed to fetch promotions.');
    }
  };

  const handleFinish = async (values) => {
    setUploading(true);
    try {
      const updatedProgram = { 
        ...values, 
        image, 
        promotions: selectedPromotions
      };
      await axios.put(`http://localhost:5000/api/updateprogram/${program._id}`, updatedProgram);
      message.success('Chương trình đã được cập nhật thành công');
      onUpdateProgram(updatedProgram);
      onClose();
    } catch (error) {
      console.error('Error updating program:', error);
      message.error('Lỗi khi cập nhật chương trình');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async ({ file }) => {
    if (file.status === 'done') {
      setImage(file.response.url);
    } else if (file.status === 'error') {
      message.error('Failed to upload image.');
    }
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'Chương trình khuyến mãi');
    
    try {
      const response = await axios.post(CLOUDINARY_URL, formData, { 
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    }
    return false; 
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}> 
      <Form.Item
        name="name"
        label="Tên chương trình"
        rules={[{ required: true, message: 'Vui lòng nhập tên chương trình!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
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
            }}
            data={form.getFieldValue('description') || '<p>Nhập mô tả tại đây...</p>'}
            onChange={(event, editor) => {
              const data = editor.getData();
              form.setFieldsValue({ description: data });
            }}
          />
        </div>
      </Form.Item>
      <Form.Item
        name="status"
        label="Trạng thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
      >
        <Select>
          <Option value={1}>Hiển thị</Option>
          <Option value={0}>Ẩn</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Mã khuyến mãi" name="promotions">
        <Select
          mode="multiple"
          placeholder="Chọn mã khuyến mãi"
          className="w-full"
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
      <Form.Item label="Hình ảnh">
        <Upload
          beforeUpload={handleUploadImage}
          showUploadList={false}
          maxCount={1}
          customRequest={handleImageChange}
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
        </Upload>
        {image && <img src={image} alt="Program" style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={uploading}>
          Cập nhật
        </Button>
        <Button onClick={onClose} style={{ marginLeft: '10px' }}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProgramForm;
