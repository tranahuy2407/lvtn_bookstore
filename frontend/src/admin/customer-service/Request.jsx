import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Request = () => {
  const [returnBooks, setReturnBooks] = useState([]);

  useEffect(() => {
    const fetchReturnBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/returnbooks');
        setReturnBooks(response.data);
      } catch (error) {
        console.error('Error fetching return books:', error);
      }
    };

    fetchReturnBooks();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/returnbooks/${id}/status`, { status: 1 });
      
      setReturnBooks((prevReturnBooks) => 
        prevReturnBooks.map((returnBook) => 
          returnBook._id === id ? { ...returnBook, status: 1 } : returnBook
        )
      );
    } catch (error) {
      console.error('Error approving return book:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Danh sách đơn đổi trả</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Mã đơn hàng</th>
            <th className="px-4 py-2 border border-gray-300">Tên người dùng</th>
            <th className="px-4 py-2 border border-gray-300">Sách yêu cầu đổi trả</th>
            <th className="px-4 py-2 border border-gray-300">Lý do</th>
            <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
            <th className="px-4 py-2 border border-gray-300">Ghi chú</th>
            <th className="px-4 py-2 border border-gray-300">Ngày tạo</th>
            <th className="px-4 py-2 border border-gray-300">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {returnBooks.map((returnBook) => (
            <tr key={returnBook._id}>
              <td className="px-4 py-2 border border-gray-300">{returnBook.order.orderCode}</td>
              <td className="px-4 py-2 border border-gray-300">{returnBook.userId.name}</td>
              <td className="px-4 py-2 border border-gray-300">
                {returnBook.books.map((book) => book.name).join(', ')}
              </td>
              <td
                className="px-4 py-2 border border-gray-300"
                dangerouslySetInnerHTML={{ __html: returnBook.reason }}
              />
              <td className="px-4 py-2  border-gray-300">
                {returnBook.status === 0 ? 'Chờ xử lý' : returnBook.status === 1 ? 'Đã xác nhận' : 'Đã xử lý'}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {returnBook.status === 1 ? 'Chờ khách hàng chọn phương thức đổi trả' : returnBook.note}
              </td>
              <td className="px-4 py-2 border border-gray-300">{new Date(returnBook.createAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  onClick={() => handleApprove(returnBook._id)}
                  disabled={returnBook.status !== 0}
                  className={`bg-blue-500 text-white px-2 py-1 rounded ${returnBook.status !== 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Duyệt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Request;
