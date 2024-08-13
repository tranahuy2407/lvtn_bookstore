import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { List, Spin, message, Card, Button, Modal, Input } from 'antd';

const ViewRequest = () => {
  const { userId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [pdfVisible, setPdfVisible] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/returns/user/${userId}`);
        setRequests(response.data);
      } catch (error) {
        message.error('Có lỗi xảy ra khi tải danh sách yêu cầu.');
        console.error('Error fetching return requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const handleExchange = (request) => {
    setCurrentRequest(request);
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      await axios.put(`http://localhost:5000/api/returns/${currentRequest._id}`, { status: 2, note: 'Khách hàng chọn đổi đơn hàng' });
      message.success('Yêu cầu đã được xử lý.');
      setRequests(requests.map(req => req._id === currentRequest._id ? { ...req, status: 2, note: 'Khách hàng chọn đổi đơn hàng' } : req));
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý yêu cầu.');
      console.error('Error updating return request:', error);
    } finally {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showPdf = (invoiceUrl) => {
    window.open(invoiceUrl, '_blank');
  };

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  return (
    <section className="py-32">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h1 className="text-gray-800 text-4xl font-extrabold sm:text-5xl">Danh Sách Yêu Cầu Đổi Trả</h1>
        <div className="mt-6">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={requests}
            renderItem={item => (
              <List.Item
                key={item._id}
                extra={<Button type="link" onClick={() => showPdf(item.invoice)} className="text-blue-600 font-semibold">Xem hóa đơn</Button>}
              >
                <List.Item.Meta
                  title={<span className="text-lg font-bold">Đơn hàng: {item.order.orderCode}</span>}
                  description={
                    <div>
                      <p className="text-md font-semibold">Lý do đổi trả:</p>
                      <div className="text-md font-medium" dangerouslySetInnerHTML={{ __html: item.reason }} />
                    </div>
                  }
                />
                <p className={`text-md font-semibold ${item.status === 0 ? 'text-red-600' : item.status === 1 ? 'text-orange-600' : 'text-green-600'}`}>
                  Status: {item.status === 0 ? 'Chờ xử lý' : item.status === 1 ? 'Đã xác nhận' : 'Đã xử lý'}
                </p>
                <p className="text-md font-semibold">Ngày tạo yêu cầu: {new Date(item.createAt).toLocaleDateString()}</p>
                <p className="text-md font-semibold">Ngày đặt hàng: {new Date(item.order.orderedAt).toLocaleDateString()}</p>
                <p className="text-md font-semibold">Sách yêu cầu:</p>
                <div className="overflow-x-auto">
                  <div className="flex space-x-4">
                    {item.books.map(book => (
                      <Card
                        key={book._id}
                        style={{ width: 200 }}
                        cover={<img alt={book.name} src={book.images} />}
                      >
                        <Card.Meta title={book.name} />
                      </Card>
                    ))}
                  </div>
                </div>
                {item.status === 1 && (
                  <div className="mt-4">
                    <Button type="primary" onClick={() => handleExchange(item)}>
                      Đổi hàng
                    </Button>
                    <Button type="default" onClick={() => handleReturn(item._id)} className="ml-2">
                      Trả hàng
                    </Button>
                  </div>
                )}
              </List.Item>
            )}
          />
        </div>
      </div>
      {currentRequest && (
        <Modal
          title={<span className="text-lg font-bold">Đơn hàng sẽ được giao lại</span>}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p className="text-red-600 text-lg font-bold mb-4">
            Bạn vui lòng gửi lại đơn hàng có vấn đề bạn đến địa chỉ 180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh
          </p>
          <p className="font-semibold mb-2">Tên:</p>
          <Input defaultValue={currentRequest.order.name} disabled />
          <p className="font-semibold mt-4 mb-2">Địa chỉ:</p>
          <Input defaultValue={currentRequest.order.address} disabled />
        </Modal>
      )}
    </section>
  );
};

export default ViewRequest;
