import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/authors');
        setAuthors(response.data);
        setTotalPages(Math.ceil(response.data.length / authorsPerPage));
      } catch (error) {
        setError('Error fetching authors');
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, [authorsPerPage]);

  const getCurrentAuthors = () => {
    const indexOfLastAuthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    return authors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  };

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

  const handleDeleteAuthor = (id) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa tác giả này không?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Có',
      cancelText: 'Không',
      onOk: async () => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/authors/${id}`);
          if (response.status === 200) {
            const updatedAuthors = authors.filter(author => author._id !== id);
            setAuthors(updatedAuthors);
            setTotalPages(Math.ceil(updatedAuthors.length / authorsPerPage));
          } else {
            setError('Error deleting author');
          }
        } catch (error) {
          setError('Error deleting author');
          console.error('Error deleting author:', error);
        }
      },
    });
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách tác giả</strong>
      <div className="mt-4 flex justify-start">
        <button
          onClick={() => navigate('/admin/dashboard/addauthors')}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Thêm tác giả
        </button>
      </div>
      <div className='mt-3'>
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              <th className='border border-gray-300'>STT</th>
              <th className='border border-gray-300'>Tên tác giả</th>
              <th className='border border-gray-300'>Mô tả</th>
              <th className='border border-gray-300'>Hình ảnh</th>
              <th className='border border-gray-300'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentAuthors().map((author, index) => (
              <tr key={author._id}>
                <td className='border border-gray-300 text-center'>{(currentPage - 1) * authorsPerPage + index + 1}</td>
                <td className='border border-gray-300 text-center'>{author.name}</td>
                <td className='border border-gray-300 text-center'>{author.description}</td>
                <td className='border border-gray-300 text-center'>
                  <img src={author.image} alt={author.name} className='h-16 w-16 object-contain mx-auto' />
                </td>
                <td className='border border-gray-300 text-center'>
                  <Link
                    to={`/admin/dashboard/updateauthor/${author._id}`}
                    className='text-blue-500 mr-2'
                  >
                    <EditOutlined />
                  </Link>
                  <button
                    onClick={() => handleDeleteAuthor(author._id)}
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
}

export default Authors;
