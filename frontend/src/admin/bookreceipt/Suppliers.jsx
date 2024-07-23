import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, message } from 'antd';

function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [suppliersPerPage] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/suppliers');
                setSuppliers(response.data);
                setTotalPages(Math.ceil(response.data.length / suppliersPerPage));
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, [suppliersPerPage]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa nhà cung cấp này không?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
                    const newSuppliers = suppliers.filter(supplier => supplier._id !== id);
                    setSuppliers(newSuppliers);
                    setTotalPages(Math.ceil(newSuppliers.length / suppliersPerPage));
                    setFeedbackMessage('Xóa nhà cung cấp thành công');
                    if (currentPage > Math.ceil(newSuppliers.length / suppliersPerPage)) {
                        setCurrentPage(currentPage - 1);
                    }
                    message.success('Xóa nhà cung cấp thành công');
                } catch (error) {
                    console.error('Error deleting supplier:', error);
                    setFeedbackMessage('Lỗi khi xoá nhà cung cấp');
                    message.error('Xóa nhà cung cấp không thành công. Vui lòng thử lại.');
                }
            },
        });
    };

    const handleAddSupplier = () => {
        navigate('/admin/dashboard/addsuppliers');
    };

    const indexOfLastSupplier = currentPage * suppliersPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
    const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

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
            <strong className='text-gray-700 font-medium'>Danh sách nhà cung cấp</strong>
            {feedbackMessage && <div className="text-green-500 mt-2">{feedbackMessage}</div>}
            <div className="mt-4 flex justify-start">
                <button
                    onClick={handleAddSupplier}
                    className='bg-green-500 text-white px-4 py-2 rounded'
                >
                    Thêm nhà cung cấp
                </button>
            </div>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <th className="w-1/6 border border-gray-300 text-center">ID</th>
                            <th className="w-1/4 border border-gray-300 text-center">Tên nhà cung cấp</th>
                            <th className="w-1/4 border border-gray-300 text-center">Email</th>
                            <th className="w-1/4 border border-gray-300 text-center">Số điện thoại</th>
                            <th className="w-1/6 border border-gray-300 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSuppliers.map(supplier => (
                            <tr key={supplier._id}>
                                <td className="w-1/6 border border-gray-300 text-center">{supplier._id}</td>
                                <td className="w-1/4 border border-gray-300 text-center">{supplier.name}</td>
                                <td className="w-1/4 border border-gray-300 text-center">{supplier.email}</td>
                                <td className="w-1/4 border border-gray-300 text-center">{supplier.phone}</td>
                                <td className="w-1/6 border border-gray-300 text-center">
                                    <div className='flex justify-center items-center space-x-4'>
                                        <Link
                                            to={`/admin/dashboard/updatesuppliers/${supplier._id}`}
                                            className='text-blue-500 flex items-center'
                                        >
                                            <FaEdit className='text-xl' />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(supplier._id)}
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
                {/* Pagination */}
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

export default Suppliers;
