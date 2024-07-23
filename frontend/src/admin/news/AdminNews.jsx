import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, message, Button, Upload, Form, Input } from 'antd';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news');
        setNews(response.data);
        setTotalPages(Math.ceil(response.data.length / newsPerPage));
      } catch (error) {
        setError('Error fetching news');
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [newsPerPage]);

  const handleDelete = (newsId) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa bài viết này không?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/news/${newsId}`);
          message.success(response.data.message);
          const newNews = news.filter(n => n._id !== newsId);
          setNews(newNews);
          setTotalPages(Math.ceil(newNews.length / newsPerPage));
          if (currentPage > Math.ceil(newNews.length / newsPerPage)) {
            setCurrentPage(currentPage - 1);
          }
        } catch (error) {
          console.error('Error deleting news:', error);
          message.error('Xóa bài viết thất bại');
        }
      },
    });
  };

  const handleAddNews = () => {
    navigate('/admin/dashboard/addnews');
  };

  const handleUploadImage = async (file) => {
    const UPLOAD_PRESET = "yznfezyj"; // Replace with your Cloudinary preset
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

  const handleFinish = async (values) => {
    setUploading(true);
    const imageUrl = await handleUploadImage(values.image.file);

    if (!imageUrl) {
      setUploading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/news', {
        ...values,
        image: imageUrl,
      });

      message.success('Bài viết được thêm thành công');
      form.resetFields();
      setNews([...news, response.data]);
      setTotalPages(Math.ceil([...news, response.data].length / newsPerPage));
    } catch (error) {
      console.error('Error adding news:', error);
      message.error('Thêm bài viết thất bại');
    } finally {
      setUploading(false);
    }
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách bài viết</strong>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="mt-4 flex justify-start">
        <button
          onClick={handleAddNews}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Thêm bài viết
        </button>
      </div>
      <div className='mt-3'>
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              <th className='border border-gray-300'>STT</th>
              <th className='border border-gray-300'>Tiêu đề</th>
              <th className='border border-gray-300'>Trạng thái</th>
              <th className='border border-gray-300'>Nội dung</th>
              <th className='border border-gray-300'>Tác giả</th>
              <th className='border border-gray-300'>Hình ảnh</th>
              <th className='border border-gray-300'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentNews.map((n, index) => (
              <tr key={n._id}>
                <td className='border border-gray-300 text-center'>{indexOfFirstNews + index + 1}</td>
                <td className='border border-gray-300 text-center'>{n.title}</td>
                <td className='border border-gray-300 text-center'>{n.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
                <td className='border border-gray-300 text-center'>{n.content}</td>
                <td className='border border-gray-300 text-center'>{n.author}</td>
                <td className='border border-gray-300 text-center'>
                  <img src={n.image} alt={n.title} className='h-16 w-16 object-contain mx-auto' />
                </td>
                <td className='border border-gray-300 text-center'>
                  <Link
                    to={{
                      pathname: `/admin/dashboard/updatenews/${n._id}`,
                      state: { news: n }
                    }}
                    className='text-blue-500 mr-2'
                  >
                    <EditOutlined />
                  </Link>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className='text-red-500'
                  >
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            className={`mx-1 px-3 py-1 rounded focus:outline-none ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <div>
            Trang {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            className={`mx-1 px-3 py-1 rounded focus:outline-none ${currentPage === totalPages ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'}`}
            disabled={currentPage === totalPages}
          >
            Trang tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
