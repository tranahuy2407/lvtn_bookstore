import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UpdateAuthor = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [messageInfo, setMessageInfo] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/authors/${authorId}`);
        const { name, description, image } = response.data;
        setName(name || '');
        setDescription(description || '');
        setImageUrl(image || '');
        setImageName(image ? image.split('/').pop() : '');
      } catch (error) {
        console.error('Error fetching author:', error);
        setMessageInfo('Không thể tải thông tin tác giả.');
      }
    };

    fetchAuthor();
  }, [authorId]);

  const handleUploadImage = async (file) => {
    const UPLOAD_PRESET = "yznfezyj";
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload";
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `Tác giả/${name}`);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!name || !description) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      setUploading(false);
      return;
    }

    try {
      let uploadedImageUrl = imageUrl;

      if (imageFile) {
        uploadedImageUrl = await handleUploadImage(imageFile);
        if (!uploadedImageUrl) {
          setUploading(false);
          return;
        }
      }

      await axios.put(`http://localhost:5000/api/authors/${authorId}`, {
        name,
        description,
        image: uploadedImageUrl || null,
      });

      setMessageInfo('Cập nhật tác giả thành công!');
      setTimeout(() => {
        navigate('/admin/dashboard/authors');
      }, 1500);
    } catch (error) {
      setMessageInfo('Có lỗi xảy ra khi cập nhật tác giả');
      console.error('Error updating author:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (info) => {
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

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Cập nhật tác giả</strong>
      <form className='mt-3' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
            Tên tác giả
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
          {imageUrl && <img src={imageUrl} alt="Author" className="mt-2 w-32 h-32 object-contain" />}
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          disabled={uploading}
        >
          {uploading ? 'Đang tải lên...' : 'Cập nhật'}
        </button>
        {messageInfo && <p className='mt-3 text-green-500'>{messageInfo}</p>}
      </form>
    </div>
  );
};

export default UpdateAuthor;
