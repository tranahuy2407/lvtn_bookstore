import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, Space, Tag, Select } from "antd";
import { UserAddOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [prevOrderCount, setPrevOrderCount] = useState(0);

  // lấy đơn hàng
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/all-orders");
      const ordersWithUserName = await Promise.all(
        response.data.map(async (order) => {
          const userName = await fetchUserName(order.userId);
          return { ...order, name: userName };
        })
      );
      setOrders(ordersWithUserName);
      setPrevOrderCount(orderCount);
      setOrderCount(ordersWithUserName.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [orderCount]);

  // lấy tên khách hàng 
  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getusername/${userId._id}`
      );
      return response.data.name;
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  };

  // lấy chi tiết đơn hàng dựa trên id
  const fetchProduct = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`
      );
      return response.data;
      

    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  };

  // Update order status
  const onUpdateOrderStatus = async () => {
    try {
      await axios.post(`http://localhost:5000/api/update-order-status`, {
        orderId: selectedOrder._id,
        status: selectedStatus,
      });

      fetchOrders();
      setSelectedOrder(null); 
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const viewOrderDetails = async (record) => {
    try {
      if (!record || !record._id) {
        console.error("Invalid record or missing order ID");
        return;
      }
  
      const response = await fetchProduct(record._id);
  
      // Check if response contains the expected properties
      if (!response || !Array.isArray(response.books)) {
        console.error("Expected response.books to be an array, but received:", response);
        Modal.info({
          title: "Chi tiết đơn hàng",
          content: (
            <div>
              <p>
                <strong>Tên khách hàng:</strong> {record.name}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong> {record.paymentMethod}
              </p>
              <p>Không tìm thấy sản phẩm nào.</p>
            </div>
          ),
          onOk() {},
        });
        return;
      }
  
      Modal.info({
        title: "Chi tiết đơn hàng",
        content: (
          <div>
            <p>
              <strong>Tên khách hàng:</strong> {record.name}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {record.paymentMethod}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {record.address}
            </p>
            <p>
              <strong>Ghi chú:</strong> {record.note}
            </p>
            <p>
              <strong>Thời gian đặt:</strong> {new Date(record.orderedAt).toLocaleString()}
            </p>
            <p>
              <strong>Trạng thái:</strong> {statusToText(record.status)}
            </p>
            <p>
              <strong>Sản phẩm:</strong>
            </p>
            <ul>
              {response.books.length > 0 ? (
                response.books.map((productDetail, index) => (
                  <li key={index}>
                    <img 
                      src={productDetail.book.images || 'default-image-url'} 
                      alt={productDetail.book.name || 'Tên sản phẩm không có'} 
                      style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '8px' }} 
                    />
                    {productDetail.book.name || 'Tên sản phẩm không có'} x {productDetail.quantity || 0} = {productDetail.book.promotion_price || 0} VND
                  </li>
                ))
              ) : (
                <p>Không tìm thấy sản phẩm nào.</p>
              )}
            </ul>
          </div>
        ),
        onOk() {},
      });
    } catch (error) {
      console.error("Error displaying order details:", error);
      Modal.error({
        title: "Lỗi",
        content: "Đã xảy ra lỗi khi hiển thị chi tiết đơn hàng.",
      });
    }
  };
  

  const statusToText = (status) => {
    switch (status) {
      case -1: return "Đã hủy";
      case 0: return "Chưa giải quyết";
      case 1: return "Đã nhận";
      case 2: return "Đang giao hàng";
      case 3: return "Đã giao";
      case 4: return "Đang tiến hành thanh toán";
      default: return "Trạng thái không xác định";
    }
  };
  
  const columns = [
    {
      key: "orderCode",
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
    },
    {
      key: "orderedAt",
      title: "Ngày giờ đặt",
      dataIndex: "orderedAt",
      render: (orderedAt) => new Date(orderedAt).toLocaleString(),
    },
    {
      key: "name",
      title: "Tên khách hàng",
      dataIndex: "name",
    },
    {
      key: "totalPrice",
      title: "Tổng cộng",
      dataIndex: "totalPrice",
    },
    {
      key: "address",
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      key: "paymentMethod",
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
    },
    {
      key: "status",
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === 3 ? "green" : "blue"}>
          { status === -1 ? "Đã hủy"
            : status === 0 ? "Chưa giải quyết"
            : status === 1 ? "Đã nhận"
            : status === 2 ? "Đang giao hàng"
             : status === 4 ? "Đã giao đến tay khách hàng"
              : status === 5 ? "Đang tiến hành thanh toán"
            : "Đã giao"}
        </Tag>
      ),
    },
    {
      key: "actions",
      title: "Tính năng",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => setSelectedOrder(record)}
          >
            Thay đổi trạng thái
          </Button>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => viewOrderDetails(record)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10000); 

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    setIsModalOpen(selectedOrder !== null);
  }, [selectedOrder]);



  return (
    <>
      <Space wrap>
        <span>Tổng số lượng đơn hàng: {orderCount}</span> 
      </Space>
      <Table columns={columns} dataSource={orders} key="orderTable" />
      <Modal
        title="Thay đổi trạng thái"
        visible={isModalOpen} 
        onCancel={() => setSelectedOrder(null)} 
        onOk={onUpdateOrderStatus}
      >
        {selectedOrder && (
          <Space direction="vertical">
            <p key="orderCode">
              <strong>Mã đơn hàng:</strong> {selectedOrder.orderCode}
            </p>
            <p key="currentStatus">
              <strong>Trạng thái đơn hàng hiện tại:</strong>{" "}
              {selectedOrder.status === 0
                ? "Chưa giải quyết"
                : selectedOrder.status === 1
                ? "Đã nhận"
                : selectedOrder.status === 2
                ? "Đang giao hàng"
                : "Đã giao"}
            </p>
            <p key="selectStatus">
              <strong>Chọn trạng thái đơn hàng hiện tại:</strong>{" "}
              <Select
                style={{ width: 200 }}
                onChange={(value) => setSelectedStatus(parseInt(value))}
                value={selectedStatus}
              >
                <Option key="0" value="0">
                  Chưa giải quyết
                </Option>
                <Option key="1" value="1">
                  Đã nhận đơn
                </Option>
                <Option key="2" value="2">
                  Đang giao hàng
                </Option>
                <Option key="3" value="3">
                  Đã giao
                </Option>
              </Select>
            </p>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default Orders;