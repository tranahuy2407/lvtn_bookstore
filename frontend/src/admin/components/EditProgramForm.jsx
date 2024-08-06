import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, message, Select, DatePicker, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const { Option } = Select;

const EditProgramForm = ({ programId, onClose, onUpdateProgram }) => {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [program, setProgram] = useState(null);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProgramData = async () => {
      if (!programId) {
        messageApi.error('Chương trình không tìm thấy.');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/programs/${programId}`);
        const programData = response.data;
        setProgram(programData);
        form.setFieldsValue({
          name: programData.name,
          description: programData.description,
          status: programData.status,
          promotions: programData.promotions.map(promo => promo._id),
        });
        setSelectedPromotions(programData.promotions.map(promo => promo._id));
        setImageUrl(programData.image || '');
        if (programData.image) {
          setImageName(programData.image.split('/').pop());
        }
      } catch (error) {
        console.error('Error fetching program data:', error);
        messageApi.error(`Failed to fetch program data: ${error.response ? error.response.data.message : error.message}`);
      }
    };

    fetchProgramData();
  }, [programId]);

  const handleUpdateProgram = async (values) => {
    setUploading(true);
    try {
      let uploadedImageUrl = imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'Chương trình khuyến mãi');

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageUrl = response.data.secure_url;
      }

      const updatedProgram = {
        ...values,
        image: uploadedImageUrl,
        promotions: selectedPromotions,
      };

      await axios.put(`http://localhost:5000/programs/${programId}`, updatedProgram);

      messageApi.success('Chương trình đã được cập nhật thành công');
      onUpdateProgram(updatedProgram);
      onClose();
    } catch (error) {
      console.error('Error updating program:', error);
      messageApi.error('Không thể cập nhật chương trình.');
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

  const handleSelectChange = (value) => {
    setSelectedPromotions(value);
  };

  const handleBooksChange = (values) => {
    form.setFieldsValue({ books: values });
  };

  return (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg'>
      {contextHolder}
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Chỉnh sửa chương trình khuyến mãi</h2>
      <Form form={form} onFinish={handleUpdateProgram} layout='vertical'>
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
              }}
              data={form.getFieldValue('description')}
              onChange={handleEditorChange}
            />
          </div>
        </Form.Item>
        <Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select placeholder='Chọn trạng thái'>
            <Option value={1}>Kích hoạt</Option>
            <Option value={0}>Không kích hoạt</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Khuyến mãi' name='promotions'>
          <Select
            mode='multiple'
            placeholder='Chọn khuyến mãi'
            className='w-full'
            onChange={handleSelectChange}
            value={selectedPromotions}
          >
            {program?.promotions.length > 0 ? (
              program.promotions.map(promo => (
                <Option key={promo._id} value={promo._id}>
                  {promo.description}
                </Option>
              ))
            ) : (
              <Option disabled>Không có khuyến mãi</Option>
            )}
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
          {imageUrl && <img src={imageUrl} alt="Program" className="mt-2 w-32 h-32 object-contain" />}
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full' disabled={uploading}>
            {uploading ? 'Đang tải lên...' : 'Cập nhật chương trình'}
          </Button>
          <Button type='default' onClick={onClose} className='ml-2'>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProgramForm;
