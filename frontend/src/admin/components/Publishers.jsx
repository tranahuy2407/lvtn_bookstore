import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [publishersPerPage] = useState(4); 
    const [totalPages, setTotalPages] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/publishers');
                setPublishers(response.data);
                setTotalPages(Math.ceil(response.data.length / publishersPerPage));
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        };

        fetchPublishers();
    }, [publishersPerPage]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/publisher/${id}`);
            const newPublishers = publishers.filter(publisher => publisher._id !== id);
            setPublishers(newPublishers);
            setTotalPages(Math.ceil(newPublishers.length / publishersPerPage)); 
            setMessage('Xóa nhà xuất bản thành công');
            if (currentPage > Math.ceil(newPublishers.length / publishersPerPage)) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error('Error deleting publisher:', error);
            setMessage('Lỗi khi xoá nhà xuất bản');
        }
    };

    const handleAddPublisher = () => {
        navigate('/admin/dashboard/addpublishers');
    };

    // Tính toán index của nhà xuất bản đầu tiên và cuối cùng trên trang hiện tại
    const indexOfLastPublisher = currentPage * publishersPerPage;
    const indexOfFirstPublisher = indexOfLastPublisher - publishersPerPage;
    const currentPublishers = publishers.slice(indexOfFirstPublisher, indexOfLastPublisher);

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

    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='text-gray-700 font-medium'>Danh sách nhà xuất bản</strong>
            {message && <div className="text-green-500 mt-2">{message}</div>}
            <div className="mt-4 flex justify-start">
                <button
                    onClick={handleAddPublisher}
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Thêm nhà xuất bản
                </button>
            </div>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <th className="w-1/6 border border-gray-300">ID</th>
                            <th className="w-1/3 border border-gray-300">Tên nhà xuất bản</th>
                            <th className="w-1/3 border border-gray-300">Mô tả</th>
                            <th className="w-1/6 border border-gray-300">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPublishers.map(publisher => (
                            <tr key={publisher._id}>
                                <td className="w-1/6 border border-gray-300">{publisher._id}</td>
                                <td className="w-1/3 border border-gray-300">{publisher.name}</td>
                                <td className="w-1/3 border border-gray-300">{publisher.description}</td>
                                <td className="w-1/6 border border-gray-300">
                                    <Link
                                        to={`/admin/dashboard/updatepublishers/${publisher._id}`} // Ensure the URL includes the id parameter
                                        className='text-blue-500 mr-2'
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(publisher._id)}
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

export default Publishers;