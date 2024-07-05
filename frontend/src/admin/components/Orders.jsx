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
          console.log("User name:", userName);
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
  const fetchProductName = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`
      );
      console.log("Product details response:", response.data);
      return response.data.products;
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
  
      const productsDetails = await fetchProductName(record._id);
  
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
            {productsDetails && productsDetails.length > 0 ? (
              <div>
                <p>
                  <strong>Sản phẩm:</strong>
                </p>
                <ul>
                  {productsDetails.map((productDetail, index) => (
                    <li key={index}>
                      {productDetail.productName} x {productDetail.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Không tìm thấy sản phẩm nào.</p>
            )}
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
          {status === 0
            ? "Chưa giải quyết"
            : status === 1
            ? "Đã nhận"
            : status === 2
            ? "Đang giao hàng"
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
            View Details
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

  // useEffect(() => {
  //   if (orderCount > prevOrderCount) {
  //     Modal.info({
  //       title: "Thông báo",
  //       content: "Có đơn hàng mới được thêm vào!",
  //     });
  //   }
  // }, [orderCount, prevOrderCount]);

  return (
    <>
      <Space wrap>
        {/* <Button type="primary" onClick={() => setIsModalOpen(true)}>
          <UserAddOutlined />
          Thêm mới đơn
        </Button> */}
        <span>Tổng số lượng đơn hàng: {orderCount}</span> 
      </Space>
      <Table columns={columns} dataSource={orders} key="orderTable" />
      <Modal
        title="Change Order Status"
        visible={isModalOpen} 
        onCancel={() => setSelectedOrder(null)} 
        onOk={onUpdateOrderStatus}
      >
        {selectedOrder && (
          <Space direction="vertical">
            <p key="orderId">
              <strong>Order ID:</strong> {selectedOrder._id}
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