import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Button, message } from 'antd';
import moment from 'moment';
import EditPromotionForm from './EditPromotionForm';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promotions');
        if (response.data && response.data.promotions) {
          setPromotions(response.data.promotions);
        } else {
          setError('Lỗi khi tải danh sách khuyến mãi');
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setError('Lỗi khi tải danh sách khuyến mãi');
      }
    };

    fetchPromotions();
  }, []);

  const handleAddPromotion = () => {
    navigate('/admin/dashboard/addpromotion');
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deletepromotion/${promotionToDelete._id}`);
      setMessageText('Khuyến mãi đã được xóa thành công');
      const response = await axios.get('http://localhost:5000/api/promotions');
      if (response.data && response.data.promotions) {
        setPromotions(response.data.promotions);
      }
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      setError('Lỗi khi xóa khuyến mãi');
    }
  };

  const handleDeleteConfirmation = (promotion) => {
    setPromotionToDelete(promotion);
    setIsDeleteModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPromotion(null);
  };

  const handleUpdatePromotion = (updatedPromotion) => {
    setPromotions((prevPromotions) =>
      prevPromotions.map((promo) =>
        promo._id === updatedPromotion._id ? updatedPromotion : promo
      )
    );
    setIsModalVisible(false);
    setMessageText('Khuyến mãi đã được cập nhật thành công');
  };

  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Danh sách khuyến mãi</strong>
      {messageText && <div className="text-green-500 mt-2">{messageText}</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="mt-4 flex justify-start">
        <button
          onClick={handleAddPromotion}
          className='bg-green-500 text-white px-4 py-2 rounded'
        >
          Thêm mã khuyến mãi
        </button>
      </div>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 py-2 px-4">STT</th>
            <th className="border border-gray-300 py-2 px-4">Hình ảnh</th>
            <th className="border border-gray-300 py-2 px-4">Mô tả</th>
            <th className="border border-gray-300 py-2 px-4">Loại</th>
            <th className="border border-gray-300 py-2 px-4">Mã</th>
            <th className="border border-gray-300 py-2 px-4">Giá trị</th>
            <th className="border border-gray-300 py-2 px-4">Ngày bắt đầu</th>
            <th className="border border-gray-300 py-2 px-4">Ngày kết thúc</th>
            <th className="border border-gray-300 py-2 px-4">Điều kiện</th>
            <th className="border border-gray-300 py-2 px-4">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo, index) => (
            <tr key={promo._id}>
              <td className="border border-gray-300 py-2 px-4">{index + 1}</td> {/* Serial Number */}
              <td className="border border-gray-300 py-2 px-4">
                <img src={promo.image} alt={promo.description} className="w-16 h-16 object-cover" />
              </td>
              <td className="border border-gray-300 py-2 px-4">{promo.description}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.type}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.code}</td>
              <td className="border border-gray-300 py-2 px-4">{promo.value}</td>
              <td className="border border-gray-300 py-2 px-4">
                {moment(promo.start_day).format('DD/MM/YYYY')}
              </td>
              <td className="border border-gray-300 py-2 px-4">
                {moment(promo.end_day).format('DD/MM/YYYY')}
              </td>
              <td className="border border-gray-300 py-2 px-4">{promo.conditional}</td>
              <td className="border border-gray-300 py-2 px-4">
                <div className='flex justify-center space-x-4'>
                  <Link
                    to="#"
                    onClick={() => handleEditPromotion(promo)}
                    className='text-blue-500'
                  >
                    <EditOutlined />
                  </Link>
                  <button
                    onClick={() => handleDeleteConfirmation(promo)}
                    className='text-red-500'
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Promotion Modal */}
      <Modal
        title="Chỉnh sửa khuyến mãi"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800} // Adjust modal width here
      >
        {selectedPromotion && (
          <EditPromotionForm
            promotion={selectedPromotion}
            onClose={handleModalClose}
            onUpdatePromotion={handleUpdatePromotion}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa khuyến mãi này không?</p>
      </Modal>
    </div>
  );
}

export default Promotions;
