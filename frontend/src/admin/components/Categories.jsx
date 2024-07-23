import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, message, Select } from 'antd';

const { Option } = Select;

function Categories() {
    const [categories, setCategories] = useState([]);
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/category-types');
                setCategoryTypes(response.data);
            } catch (error) {
                setError('Error fetching category types');
                console.error('Error fetching category types:', error);
            }
        };

        fetchCategoryTypes();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = filterType 
                    ? await axios.get(`http://localhost:5000/api/categories/${filterType}`)
                    : await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
                setTotalPages(Math.ceil(response.data.length / categoriesPerPage));
            } catch (error) {
                setError('Error fetching categories');
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [categoriesPerPage, filterType]);

    const handleDelete = (categoryId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa thể loại này không?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    const response = await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
                    setMessage(response.data.message);
                    const newCategories = categories.filter(category => category._id !== categoryId);
                    setCategories(newCategories);
                    setTotalPages(Math.ceil(newCategories.length / categoriesPerPage));
                    if (currentPage > Math.ceil(newCategories.length / categoriesPerPage)) {
                        setCurrentPage(currentPage - 1);
                    }
                } catch (error) {
                    console.error('Error deleting category:', error);
                    setMessage('Xóa thể loại thất bại');
                }
            },
        });
    };

    const handleAddCategory = () => {
        navigate('/admin/dashboard/addcategories');
    };

    const handleTypeChange = (value) => {
        setFilterType(value);
        setCurrentPage(1);
    };

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

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
            <div className="flex justify-between items-center">
                <strong className='text-gray-700 font-medium'>Danh sách thể loại</strong>
                <Select
                    placeholder="Chọn loại"
                    onChange={handleTypeChange}
                    style={{ width: 200 }}
                >
                    <Option value="">Tất cả</Option>
                    {categoryTypes.map((type, index) => (
                        <Option key={index} value={type}>{type}</Option>
                    ))}
                </Select>
            </div>
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
                            <th className='border border-gray-300'>STT</th>
                            <th className='border border-gray-300'>Tên thể loại</th>
                            <th className='border border-gray-300'>Mô tả</th>
                            <th className='border border-gray-300'>Hình ảnh</th>
                            <th className='border border-gray-300'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map((category, index) => (
                            <tr key={category._id}>
                                <td className='border border-gray-300 text-center'>{(currentPage - 1) * categoriesPerPage + index + 1}</td>
                                <td className='border border-gray-300 text-center'>{category.name}</td>
                                <td className='border border-gray-300 text-center'>{category.description}</td>
                                <td className='border border-gray-300 text-center'>
                                    <img src={category.image} alt={category.name} className='h-16 w-16 object-contain mx-auto' />
                                </td>
                                <td className='border border-gray-300 text-center'>
                                    <Link
                                        to={{
                                            pathname: `/admin/dashboard/updatecategory/${category._id}`,
                                            state: { category }
                                        }}
                                        className='text-blue-500 mr-2'
                                    >
                                        <EditOutlined />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category._id)}
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

export default Categories;
