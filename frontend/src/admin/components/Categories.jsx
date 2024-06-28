import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(4); // Số lượng thể loại hiển thị trên mỗi trang
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
                // Tính toán số lượng trang dựa trên số lượng thể loại
                setTotalPages(Math.ceil(response.data.length / categoriesPerPage));
            } catch (error) {
                setError('Error fetching categories');
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [categoriesPerPage]); // Sử dụng categoriesPerPage để cập nhật lại khi thay đổi số lượng trang

    const handleDelete = async (categoryId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
            setMessage(response.data.message);
            // Sau khi xóa, cần fetch lại danh sách thể loại
            const newCategories = categories.filter(category => category._id !== categoryId);
            setCategories(newCategories);
            setTotalPages(Math.ceil(newCategories.length / categoriesPerPage)); // Cập nhật lại số lượng trang
            // Nếu xóa phần tử cuối cùng trên trang hiện tại và trang hiện tại trở thành trang trống, quay lại trang trước đó
            if (currentPage > Math.ceil(newCategories.length / categoriesPerPage)) {
                setCurrentPage(currentPage - 1);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Xóa thể loại thất bại');
        }
    };

    const handleAddCategory = () => {
        navigate('/admin/dashboard/addcategories'); // Chuyển hướng sang trang thêm thể loại
    };

    // Tính toán index của thể loại đầu tiên và cuối cùng trên trang hiện tại
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

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
            <strong className='text-gray-700 font-medium'>Danh sách thể loại</strong>
            {message && <div className="text-green-500 mt-2">{message}</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className="mt-4 flex justify-start">
                    <button
                        onClick={handleAddCategory}
                        className='bg-green-500 text-white px-4 py-2 rounded'
                    >
                        Thêm thể loại
                    </button>
            </div>
            <div className='mt-3'>
                <table className='w-full text-gray-700'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300'>ID</th>
                            <th className='border border-gray-300'>Tên thể loại</th>
                            <th className='border border-gray-300'>Mô tả</th>
                            <th className='border border-gray-300'>Hình ảnh</th>
                            <th className='border border-gray-300'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map(category => (
                            <tr key={category._id}>
                                <td className='border border-gray-300'>{category._id}</td>
                                <td className='border border-gray-300'>{category.name}</td>
                                <td className='border border-gray-300'>{category.description}</td>
                                <td className='border border-gray-300'><img src={category.image} alt={category.name} /></td>
                                <td className='border border-gray-300'>
                                    <Link
                                        to={{
                                            pathname: `/admin/dashboard/updatecategory/${category._id}`,
                                            state: { category } // Truyền thông tin thể loại vào props state
                                        }}
                                        className='text-blue-500 mr-2'
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category._id)}
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

export default Categories;