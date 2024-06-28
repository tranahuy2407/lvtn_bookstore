import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage] = useState(5); // Số lượng trong 1 page
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/authors');
        setAuthors(response.data);
        // Calculate total pages based on total authors and authorsPerPage
        setTotalPages(Math.ceil(response.data.length / authorsPerPage));
      } catch (error) {
        setError('Error fetching authors');
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, [authorsPerPage]); // Depend on authorsPerPage to recalculate total pages when it changes

  // Function to get current authors based on currentPage
  const getCurrentAuthors = () => {
    const indexOfLastAuthor = currentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    return authors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  };

  // Chuyển đổi sang trang trước đó
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chuyển đổi sang trang kế tiếp
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Xử lý sự kiện khi nhấn nút xoá
  const handleDeleteAuthor = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/authors/${id}`);
      if (response.status === 200) {
        // Xoá thành công, cập nhật lại danh sách tác giả
        const updatedAuthors = authors.filter(author => author._id !== id);
        setAuthors(updatedAuthors);
        // Cập nhật lại số trang nếu cần thiết
        setTotalPages(Math.ceil(updatedAuthors.length / authorsPerPage));
      } else {
        setError('Error deleting author');
      }
    } catch (error) {
      setError('Error deleting author');
      console.error('Error deleting author:', error);
    }
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách tác giả</strong>
      <div className="mt-4 flex justify-start">
        <Link to="/admin/dashboard/addauthors" className='bg-green-500 text-white px-4 py-2 rounded' style={{ textDecoration: 'none' }}>
          Thêm tác giả
        </Link>
      </div>
      <div className='mt-3'>
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              <th className='border border-gray-300'>ID</th>
              <th className='border border-gray-300'>Tên tác giả</th>
              <th className='border border-gray-300'>Mô tả</th>
              <th className='border border-gray-300'>Hình ảnh</th>
              <th className='border border-gray-300'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentAuthors().map(author => (
              <tr key={author._id}>
                <td className='border border-gray-300'>{author._id}</td>
                <td className='border border-gray-300'>{author.name}</td>
                <td className='border border-gray-300'>{author.description}</td>
                <td className='border border-gray-300'><img src={author.image} alt={author.name} style={{ width: '100px', height: 'auto' }} /></td>
                <td className='border border-gray-300'>
                  <Link
                    to={`/admin/dashboard/updateauthor/${author._id}`}
                    className='text-blue-500 mr-2'
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDeleteAuthor(author._id)}
                    className='text-red-500'
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Phân trang */}
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