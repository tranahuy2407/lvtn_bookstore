import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Typography, Button } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const CategoryBookReceipt = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch the book receipts data from the API
    const fetchBookReceipts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/book-receipts");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching book receipts:", error);
      }
    };

    fetchBookReceipts();
  }, []);

  const columns = [
    {
      title: 'Mã phiếu nhập',
      dataIndex: '_id',
      key: '_id',
      render: text => <Link to={`/book-receipt/view/${text}`}>{text}</Link>,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Số lượng sách',
      key: 'books',
      render: (_, record) => {
        if (Array.isArray(record.books)) {
          return record.books.reduce((total, book) => {
            if (book.quantity) {
              return total + book.quantity;
            }
            return total;
          }, 0);
        }
        return 0;
      },
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: text => `${text.toLocaleString()} VND`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => window.location.href = `/admin/dashboard/book-receipt/edit/${record._id}`}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => window.location.href = `/admin/dashboard/book-receipt/view/${record._id}`}
          />
        </div>
      ),
    },
  ];
  

  return (
    <div className="p-4">
      <Title level={2}>Danh sách hóa đơn sách</Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CategoryBookReceipt;
