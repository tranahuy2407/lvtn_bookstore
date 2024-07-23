import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [messageInfo, setMessageInfo] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        const categories = response.data;
        const uniqueTypes = [...new Set(categories.map(cat => cat.type))];
        setTypes(uniqueTypes);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleUploadImage = async (file) => {
    const UPLOAD_PRESET = "yznfezyj";
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `Danh Mục/${name}`);
  
    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false, 
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Validate required fields
    if (!name || !description || !type) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      setUploading(false);
      return;
    }

    try {
      let uploadedImageUrl = null;

      // Handle image upload if an image file is selected
      if (imageFile) {
        uploadedImageUrl = await handleUploadImage(imageFile);
        if (!uploadedImageUrl) {
          setUploading(false);
          return;
        }
      }

      await axios.post('http://localhost:5000/api/addcategories', {
        name,
        description,
        type,
        image: uploadedImageUrl || null, 
      });

      setMessageInfo('Thêm thể loại thành công!');
      setName('');
      setDescription('');
      setType('');
      setImageFile(null);
      setImageName('');
      setTimeout(() => {
        navigate('/admin/dashboard/categories');
      }, 1500);
    } catch (error) {
      setMessageInfo('Có lỗi xảy ra khi thêm thể loại');
      console.error('Error adding category:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (info) => {
    const { file } = info;
    if (file.status === 'done') {
      setImageFile(file.originFileObj);
      setImageName(file.name);
    } else if (file.status === 'error') {
      setImageFile(null);
      setImageName('');
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Thêm thể loại</strong>
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Tên thể loại
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='description'>
            Mô tả
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='type'>
            Loại
          </label>
          <Select
            id='type'
            value={type}
            onChange={(value) => setType(value)}
            className='w-full'
            placeholder='Chọn loại'
          >
            {types.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </div>
        <div className='mb-4'>
          <label htmlFor='image' className='block text-gray-700 text-sm font-bold mb-2'>
            Hình ảnh
          </label>
          <Upload
            beforeUpload={(file) => {
              setImageFile(file);
              setImageName(file.name);
              return false; // Prevent automatic upload
            }}
            onChange={handleChange}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {imageName && <p className='mt-2 text-gray-500'>Hình ảnh đã chọn: {imageName}</p>}
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          disabled={uploading}
        >
          {uploading ? 'Đang tải lên...' : 'Thêm'}
        </button>
        {messageInfo && <p className='mt-3 text-green-500'>{messageInfo}</p>}
      </form>
    </div>
  );
};

export default AddCategory;
