import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, message } from 'antd';

const { confirm } = Modal;

function Publishers() {
    const [publishers, setPublishers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [publishersPerPage] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(''); // Thay đổi message thành error
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

    const handleDelete = (id) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa nhà xuất bản này không?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:5000/api/delete-publisher/${id}`);
                    
                    if (response.status === 200) {
                        const newPublishers = publishers.filter(publisher => publisher._id !== id);
                        setPublishers(newPublishers);
                        setTotalPages(Math.ceil(newPublishers.length / publishersPerPage));
                        setError(''); // Xóa thông báo lỗi nếu xóa thành công
                        if (currentPage > Math.ceil(newPublishers.length / publishersPerPage)) {
                            setCurrentPage(currentPage - 1);
                        }
                        message.success('Xóa nhà xuất bản thành công.');
                    } else {
                        setError(response.data.message || 'Lỗi khi xóa nhà xuất bản');
                    }
                } catch (error) {
                    setError(error.response?.data?.message || 'Lỗi khi xóa nhà xuất bản');
                    message.error(error.response?.data?.message || 'Lỗi khi xóa nhà xuất bản');
                    console.error('Error deleting publisher:', error);
                }
            },
        });
    };

    const handleAddPublisher = () => {
        navigate('/admin/dashboard/addpublishers');
    };

    const indexOfLastPublisher = currentPage * publishersPerPage;
    const indexOfFirstPublisher = indexOfLastPublisher - publishersPerPage;
    const currentPublishers = publishers.slice(indexOfFirstPublisher, indexOfLastPublisher);

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
            <strong className='text-gray-700 font-medium'>Danh sách nhà xuất bản</strong>
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
                            <th className="w-1/12 border border-gray-300 text-center">STT</th>
                            <th className="w-1/3 border border-gray-300 text-center">Tên nhà xuất bản</th>
                            <th className="w-1/3 border border-gray-300 text-center">Mô tả</th>
                            <th className="w-1/6 border border-gray-300 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPublishers.map((publisher, index) => (
                            <tr key={publisher._id}>
                                <td className="w-1/12 border border-gray-300 text-center">{indexOfFirstPublisher + index + 1}</td>
                                <td className="w-1/3 border border-gray-300 text-center">{publisher.name}</td>
                                <td className="w-1/3 border border-gray-300 text-center">{publisher.description}</td>
                                <td className="w-1/6 border border-gray-300 text-center">
                                    <div className='flex justify-center items-center space-x-4'>
                                        <Link
                                            to={`/admin/dashboard/updatepublishers/${publisher._id}`}
                                            className='text-blue-500 flex items-center'
                                        >
                                            <FaEdit className='text-xl' />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(publisher._id)}
                                            className='text-red-500 flex items-center'
                                        >
                                            <FaTrash className='text-xl' />
                                        </button>
                                    </div>
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

export default Publishers;
