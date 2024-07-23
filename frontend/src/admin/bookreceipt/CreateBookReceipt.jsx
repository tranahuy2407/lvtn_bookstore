import React, { useState } from 'react';
import moment from 'moment'; 
import { Select, DatePicker, Button, InputNumber, Table, message, Input, Upload, Modal } from 'antd';
import { Option } from 'antd/es/mentions';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Column } = Table;

const CreateBookReceipt = () => {
  const [products] = useState([
    { id: 1, name: 'Sản phẩm A', price: 100000 },
    { id: 2, name: 'Sản phẩm B', price: 150000 },
    { id: 3, name: 'Sản phẩm C', price: 200000 },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [date] = useState(moment().format('DD/MM/YYYY')); 

  const handleProductChange = (values) => {
    setSelectedProducts(values);
  };

  const handleAddProduct = () => {
    const selectedProductsDetails = products.filter(p => selectedProducts.includes(p.id));
    
    // Check if product is already in receiptItems
    const existingProductIds = new Set(receiptItems.map(item => item.id));
    const newItems = selectedProductsDetails.filter(p => !existingProductIds.has(p.id))
      .map(p => ({ ...p, quantity: 1 }));
    
    if (newItems.length < selectedProductsDetails.length) {
      message.error('Một số sản phẩm đã có trong phiếu nhập.');
    }
    
    setReceiptItems(prevItems => [...prevItems, ...newItems]);
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...receiptItems];
    newItems[index].quantity = value;
    setReceiptItems(newItems);
  };

  const handlePriceChange = (index, value) => {
    const newItems = [...receiptItems];
    newItems[index].price = parseFloat(value) || 0; 
    setReceiptItems(newItems);
  };

  const handleRemoveItem = (index) => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa sản phẩm này khỏi phiếu nhập?',
      onOk: () => {
        const newItems = [...receiptItems];
        newItems.splice(index, 1);
        setReceiptItems(newItems);
      }
    });
  };

  const handleSaveReceipt = () => {
    if (!supplier) {
      message.error('Vui lòng chọn nhà cung cấp.');
      return;
    }
    message.success('Phiếu nhập hàng đã được lưu.');
  };

  const handleUpload = (file) => {
    console.log('Uploaded file:', file);
    message.success('Tệp Excel đã được tải lên.');
    return false;
  };

  // Calculate total
  const totalAmount = receiptItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold">Nhập hàng</h1>
        <Upload
          customRequest={({ file, onSuccess }) => {
            handleUpload(file);
            onSuccess(null, file);
          }}
          showUploadList={false}
          accept=".xls, .xlsx"
        >
          <Button icon={<UploadOutlined />} type="primary">
            Nhập Excel
          </Button>
        </Upload>
      </div>

      <div className="flex">
        <div className="w-1/3 p-4 border-r border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Thông tin phiếu nhập</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Nhà cung cấp</label>
            <Select
              placeholder="Chọn nhà cung cấp"
              className="w-full"
              onChange={(value) => setSupplier(value)}
            >
              <Option value="supplier1">Nhà cung cấp 1</Option>
              <Option value="supplier2">Nhà cung cấp 2</Option>
              <Option value="supplier3">Nhà cung cấp 3</Option>
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ngày tạo đơn</label>
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              defaultValue={moment()}  // Set default value to today
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Chọn sản phẩm</label>
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              className="w-full"
              onChange={handleProductChange}
            >
              {products.map(product => (
                <Option key={product.id} value={product.id}>
                  {product.name}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              className="mt-2"
              onClick={handleAddProduct}
            >
              Thêm vào phiếu
            </Button>
          </div>
        </div>

        <div className="w-2/3 p-4">
          <h2 className="text-lg font-semibold mb-4">Chi tiêt phiếu nhập</h2>
          <Table dataSource={receiptItems} rowKey="id" pagination={false}>
            <Column title="Sản phẩm" dataIndex="name" key="name" />
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
                  onBlur={() => handlePriceChange(index, text)} // Ensure value is correctly parsed on blur
                />
              )}
            />
            <Column
              title="Tạm tính"
              key="total"
              render={(text, record) => record.price * record.quantity}
            />
            <Column
              title="Thao tác"
              key="action"
              render={(text, record, index) => (
                <Button type="link" onClick={() => handleRemoveItem(index)}>
                  <DeleteOutlined />
                </Button>
              )}
            />
          </Table>
          <div className="flex justify-between items-center mt-4">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="text-xl font-bold">₫{totalAmount.toLocaleString()}</span>
          </div>
          <Button
            type="primary"
            className="mt-4"
            onClick={handleSaveReceipt}
          >
            Lưu phiếu nhập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBookReceipt;
