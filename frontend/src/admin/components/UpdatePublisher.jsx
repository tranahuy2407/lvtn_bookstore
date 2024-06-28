import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPublisherForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPublisher = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/publisher/${id}`);
                setName(response.data.name);
                setDescription(response.data.description);
            } catch (error) {
                console.error('Error fetching publisher:', error);
            }
        };

        fetchPublisher();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/publisher/${id}`, { name, description });
            setMessage('Cập nhật nhà xuất bản thành công');
            setTimeout(() => {
                navigate('/admin/dashboard/publishers'); // Điều hướng trở lại danh sách nhà xuất bản sau khi cập nhật thành công
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi cập nhật nhà xuất bản:', error);
            setMessage('Lỗi khi cập nhật nhà xuất bản');
        }
    };

    const handleCancel = () => {
        navigate('/admin/dashboard/publishers'); // Điều hướng trở lại danh sách nhà xuất bản khi nhấn Cancel
    };

    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='text-gray-700 font-medium'>Sửa nhà xuất bản</strong>
            {message && <div className="text-green-500 mt-2">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Tên nhà xuất bản:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                    ></textarea>
                </div > 
                <div className="flex justify-end space-x-4">
                <button type="button" onClick={handleCancel} className='bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2'>Hủy</button>
                <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded mt-2'>Lưu</button>
                </div>
            </form>
        </div>
    );
}

export default EditPublisherForm;