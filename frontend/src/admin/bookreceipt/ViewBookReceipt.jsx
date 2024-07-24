import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button, Spin } from "antd";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

const ViewBookReceipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/book-receipts/${id}`
        );
        setReceipt(response.data);
      } catch (error) {
        console.error("Error fetching book receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) return <Spin />;

  if (!receipt) return <Text>Receipt not found</Text>;

  return (
    <div className="p-4">
      <Title level={2}>Chi tiết phiếu nhập sách</Title>
      <Text strong>Mã phiếu nhập: </Text>
      {receipt._id}
      <br />
      <Text strong>Nhà cung cấp: </Text>
      {receipt.supplier.name}
      <br />
      <Text strong>Ngày tạo: </Text>
      {new Date(receipt.createAt).toLocaleDateString()}
      <br />
      <Text strong>Số lượng sách: </Text>
      {receipt.books.reduce((total, book) => total + book.quantity, 0)}
      <br />
      <Text strong>Tổng giá: </Text>
      {receipt.totalPrice.toLocaleString()} VND
      <br />
      <Title level={3}>Danh sách sách nhập:</Title>
      {receipt.books.map((bookItem, index) => (
        <div key={index}>
          <Text strong>Tên sách: </Text>{bookItem.book.name}<br />
          <Text strong>Số lượng: </Text>{bookItem.quantity}<br />
          <Text strong>Giá nhập: </Text>{bookItem.price.toLocaleString()} VND<br />
          <br />
        </div>
      ))}
      <Button href="/admin/dashboard/categories-bookreceipt">Trở lại</Button>
    </div>
  );
};

export default ViewBookReceipt;
