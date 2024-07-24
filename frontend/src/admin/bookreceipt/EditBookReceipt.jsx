import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Spin, Select, message as antMessage, Typography, InputNumber, Table, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { Column } = Table;

const EditBookReceipt = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [receiptResponse, suppliersResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/book-receipts/${id}`),
          axios.get(`http://localhost:5000/api/suppliers`),
          axios.get(`http://localhost:5000/api/products`),
        ]);

        setReceipt(receiptResponse.data);
        setTotalPrice(receiptResponse.data.totalPrice);
        setSuppliers(suppliersResponse.data);
        setProducts(productsResponse.data);
        setSelectedSupplier(receiptResponse.data.supplier._id); // Ensure _id is set for Select value
        setSelectedProducts(receiptResponse.data.books || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleProductChange = (value) => {
    const newProducts = products.filter(p => value.includes(p._id) && !selectedProducts.some(sp => sp.book._id === p._id));
    if (newProducts.length > 0) {
      const newItems = newProducts.map(p => ({
        book: {
          _id: p._id,
          name: p.name,
          images: p.images,
        },
        quantity: 1,
        price: p.price
      }));
      setSelectedProducts(prevItems => [...prevItems, ...newItems]);
    } else {
      antMessage.error('Tất cả sản phẩm đã chọn đã có trong biên nhận.');
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].quantity = value;
    setSelectedProducts(updatedProducts);
  };

  const handlePriceChange = (index, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index].price = parseFloat(value) || 0;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveItem = (index) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi biên nhận không?',
      onOk: () => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/book-receipts/${id}`, {
        supplier: selectedSupplier,
        books: selectedProducts,
        totalPrice,
      });
      setMessage('Cập nhật biên nhận thành công');
      setTimeout(() => {
        navigate('/admin/dashboard/categories-bookreceipt');
      }, 2000);
    } catch (error) {
      console.error("Error updating book receipt:", error);
      setMessage('Lỗi khi cập nhật biên nhận');
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/categories-bookreceipt');
  };

  if (loading) return <Spin />;

  if (!receipt) return <div>Biên nhận không tồn tại</div>;

  const totalAmount = selectedProducts.reduce((total, item) => {
    if (item.price && item.quantity) {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0);

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className='text-gray-700 font-medium'>Chỉnh sửa biên nhận</strong>
      {message && <div className="text-green-500 mt-2">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Nhà cung cấp:</label>
          <Select
            value={selectedSupplier}
            onChange={setSelectedSupplier}
            className="w-full"
          >
            {suppliers.map((supplier) => (
              <Option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-gray-700">Chọn sản phẩm:</label>
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm"
            className="w-full"
            onChange={handleProductChange}
            value={selectedProducts.map(p => p.book._id)}
          >
            {products.map(product => (
              <Option key={product._id} value={product._id}>
                {product.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table dataSource={selectedProducts} rowKey="book._id" pagination={false}>
          <Column
            title="Sản phẩm"
            key="product"
            render={(text, record) => (
              <div className="flex items-center">
                <img
                  src={record.book.images}
                  alt={record.book.name}
                  style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                />
                {record.book.name}
              </div>
            )}
          />
          <Column
            title="Số lượng"
            dataIndex="quantity"
            key="quantity"
            render={(text, record, index) => (
              <InputNumber
                min={1}
                value={text}
                onChange={(value) => handleQuantityChange(index, value)}
              />
            )}
          />
          <Column
            title="Đơn giá"
            dataIndex="price"
            key="price"
            render={(text, record, index) => (
              <Input
                type="number"
                value={text}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                addonBefore="₫"
                onBlur={() => handlePriceChange(index, text)}
              />
            )}
          />
          <Column
            title="Thành tiền"
            key="total"
            render={(text, record) => (record.price * record.quantity) || 0}
          />
          <Column
            title="Hành động"
            key="action"
            render={(text, record, index) => (
              <Button type="link" onClick={() => handleRemoveItem(index)}>
                <DeleteOutlined />
              </Button>
            )}
          />
        </Table>

        <div>
          <label className="block text-gray-700">Tổng số tiền:</label>
          <Input
            type="number"
            value={totalAmount}
            readOnly
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={handleCancel} className='bg-gray-500 text-white'>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBookReceipt;
