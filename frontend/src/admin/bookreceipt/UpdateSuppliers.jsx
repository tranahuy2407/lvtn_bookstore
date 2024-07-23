import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateSupplier() {
    const { supplierId } = useParams();
    console.log(supplierId)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/suppliers/${supplierId}`);
                setName(response.data.name);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setAddress(response.data.address);
            } catch (error) {
                console.error('Error fetching supplier:', error);
            }
        };

        fetchSupplier();
    }, [supplierId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/suppliers/${supplierId}`, {
                name, email, phone, address
            });
            navigate('/admin/dashboard/suppliers');
        } catch (error) {
            console.error('Error updating supplier:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cập Nhật Nhà Cung Cấp</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 mb-2">Tên:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Số điện thoại:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Địa chỉ:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Cập Nhật
                </button>
            </form>
        </div>
    );
}

export default UpdateSupplier;
