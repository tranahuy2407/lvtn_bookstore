import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Button, message } from 'antd';
import EditProgramForm from './EditProgramForm';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isPromotionsModalVisible, setIsPromotionsModalVisible] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/programs');
        if (response.data) {
          setPrograms(response.data);
        } else {
          setError('Lỗi khi tải danh sách chương trình');
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
        setError('Lỗi khi tải danh sách chương trình');
      }
    };

    fetchPrograms();
  }, []);

  const handleAddProgram = () => {
    navigate('/admin/dashboard/addprogram');
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteprogram/${programToDelete._id}`);
      setMessageText('Chương trình đã được xóa thành công');
      const response = await axios.get('http://localhost:5000/programs');
      if (response.data) {
        setPrograms(response.data);
      }
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting program:', error);
      setError('Lỗi khi xóa chương trình');
    }
  };

  const handleDeleteConfirmation = (program) => {
    setProgramToDelete(program);
    setIsDeleteModalVisible(true);
  };

  const handleShowPromotions = (program) => {
    setSelectedPromotions(program.promotions);
    setIsPromotionsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProgram(null);
  };

  const handlePromotionsModalClose = () => {
    setIsPromotionsModalVisible(false);
    setSelectedPromotions([]);
  };

  const handleUpdateProgram = (updatedProgram) => {
    setPrograms((prevPrograms) =>
      prevPrograms.map((prog) =>
        prog._id === updatedProgram._id ? updatedProgram : prog
      )
    );
    setIsModalVisible(false);
    setMessageText('Chương trình đã được cập nhật thành công');
  };

  return (
    <div className='bg-white px-6 pt-6 pb-6 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium text-xl'>Danh sách chương trình khuyến mãi</strong>
      {messageText && <div className="text-green-500 mt-2">{messageText}</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="mt-4 flex justify-start">
        <button
          onClick={handleAddProgram}
          className='bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700 transition'
        >
          Thêm chương trình khuyến mãi
        </button>
      </div>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 py-2 px-4 text-center">STT</th>
            <th className="border border-gray-300 py-2 px-4 text-center">Hình ảnh</th>
            <th className="border border-gray-300 py-2 px-4 text-center">Tên</th>
            <th className="border border-gray-300 py-2 px-4 text-center">Mô tả</th>
            <th className="border border-gray-300 py-2 px-4 text-center">Trạng thái</th>
            <th className="border border-gray-300 py-2 px-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((prog, index) => (
            <tr key={prog._id}>
              <td className="border border-gray-300 py-2 px-4 text-center">{index + 1}</td>
              <td className="border border-gray-300 py-2 px-4 text-center">
                <img src={prog.image} alt={prog.name} className="w-20 h-20 object-cover mx-auto" />
              </td>
              <td className="border border-gray-300 py-2 px-4 text-center">{prog.name}</td>
              <td className="border border-gray-300 py-2 px-4 text-center">{prog.description}</td>
              <td className="border border-gray-300 py-2 px-4 text-center">{prog.status === 1 ? 'Hiển thị' : 'Ẩn'}</td>
              <td className="border border-gray-300 py-2 px-4 text-center">
                <div className='flex justify-center space-x-4'>
                  <Link
                    to="#"
                    onClick={() => handleEditProgram(prog)}
                    className='text-blue-600 hover:text-blue-700'
                  >
                    <EditOutlined />
                  </Link>
                  <button
                    onClick={() => handleDeleteConfirmation(prog)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <DeleteOutlined />
                  </button>
                  <button
                    onClick={() => handleShowPromotions(prog)}
                    className='text-green-600 hover:text-green-700'
                  >
                    <EyeOutlined />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Chỉnh sửa chương trình"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={900}
      >
        {selectedProgram && (
          <EditProgramForm
            program={selectedProgram}
            onClose={handleModalClose}
            onUpdateProgram={handleUpdateProgram}
          />
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa chương trình này không?</p>
      </Modal>

      <Modal
        title="Danh sách khuyến mãi"
        visible={isPromotionsModalVisible}
        onCancel={handlePromotionsModalClose}
        footer={null}
        width={900}
      >
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 py-2 px-4 text-center">STT</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Hình ảnh</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Mô tả</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Loại</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Mã</th>
              <th className="border border-gray-300 py-2 px-4 text-center">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {selectedPromotions.map((promo, index) => (
              <tr key={promo._id}>
                <td className="border border-gray-300 py-2 px-4 text-center">{index + 1}</td>
                <td className="border border-gray-300 py-2 px-4 text-center">
                  <img src={promo.image} alt={promo.description} className="w-20 h-20 object-cover mx-auto" />
                </td>
                <td className="border border-gray-300 py-2 px-4 text-center">{promo.description}</td>
                <td className="border border-gray-300 py-2 px-4 text-center">{promo.type}</td>
                <td className="border border-gray-300 py-2 px-4 text-center">{promo.code}</td>
                <td className="border border-gray-300 py-2 px-4 text-center">{promo.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default Programs;
