import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import * as XLSX from "xlsx";
import {
  Select,
  DatePicker,
  Button,
  InputNumber,
  Table,
  message,
  Input,
  Upload,
  Modal,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Column } = Table;

const CreateBookReceipt = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [receiptItems, setReceiptItems] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierLookup, setSupplierLookup] = useState({});
  const [date] = useState(moment().format("DD/MM/YYYY"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/suppliers");
        const suppliersData = response.data;
        setSuppliers(suppliersData);

        // Create a lookup object for suppliers
        const lookup = {};
        suppliersData.forEach((supplier) => {
          lookup[supplier._id] = supplier.name;
        });
        setSupplierLookup(lookup);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        message.error("Failed to fetch suppliers.");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        message.error("Failed to fetch products.");
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const handleProductChange = (values) => {
    setSelectedProducts(values);
  };

  const handleAddProduct = () => {
    const selectedProductsDetails = products.filter((p) =>
      selectedProducts.includes(p._id)
    );

    const existingProductIds = new Set(
      receiptItems.map((item) => item.book._id)
    );
    const newItems = selectedProductsDetails
      .filter((p) => !existingProductIds.has(p._id))
      .map((p) => ({
        book: p,
        quantity: 1,
        price: p.price,
        supplier: supplier,
      }));

    if (newItems.length < selectedProductsDetails.length) {
      message.error("Một số sản phẩm đã có trong phiếu nhập.");
    }

    setReceiptItems((prevItems) => [...prevItems, ...newItems]);
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
      title: "Bạn có chắc muốn xóa sản phẩm này khỏi phiếu nhập?",
      onOk: () => {
        const newItems = [...receiptItems];
        newItems.splice(index, 1);
        setReceiptItems(newItems);
      },
    });
  };

  const handleSaveReceipt = async () => {
    if (!supplier) {
      message.error("Vui lòng chọn nhà cung cấp.");
      return;
    }

    setLoading(true);
    try {
      const totalAmount = receiptItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      const response = await axios.post(
        "http://localhost:5000/api/book-receipts",
        {
          books: receiptItems,
          totalPrice: totalAmount,
          supplierId: supplier,
        }
      );

      message.success("Phiếu nhập hàng đã được lưu.");
      setReceiptItems([]);
      setSupplier(null);
    } catch (err) {
      console.error("Error saving receipt:", err);
      message.error("Failed to save receipt.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Xóa các dòng trống
      const filteredData = jsonData.filter(
        (item) =>
          item["Tên sách"] &&
          item["Số lượng"] &&
          item["Đơn giá"] &&
          item["Ảnh"] &&
          item["Nhà cung cấp"]
      );

      // Xử lý dữ liệu Excel
      const newItems = filteredData.map((item) => ({
        book: {
          name: item["Tên sách"],
          price: item["Đơn giá"],
          images: item["Ảnh"],
        },
        quantity: item["Số lượng"],
        price: item["Đơn giá"],
        supplier: item["Nhà cung cấp"], // Sử dụng tên nhà cung cấp trực tiếp
      }));

      setReceiptItems(newItems);
      message.success("Tệp Excel đã được tải lên và dữ liệu đã được cập nhật.");
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const totalAmount = receiptItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
              value={supplier}
            >
              {suppliers.map((supplier) => (
                <Option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ngày tạo đơn</label>
            <DatePicker
              className="w-full"
              format="DD/MM/YYYY"
              defaultValue={moment()}
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
              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>
            <Button type="primary" className="mt-2" onClick={handleAddProduct}>
              Thêm vào phiếu
            </Button>
          </div>
        </div>

        <div className="w-2/3 p-4">
          <h2 className="text-lg font-semibold mb-4">Chi tiết phiếu nhập</h2>
          <Table dataSource={receiptItems} rowKey="book._id" pagination={false}>
            <Column
              title="Sản phẩm"
              key="product"
              render={(text, record) => (
                <div className="flex items-center">
                  <img
                    src={record.book.images}
                    alt={record.book.name}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      marginRight: 10,
                    }}
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
              title="Tạm tính"
              key="total"
              render={(text, record) => record.price * record.quantity}
            />
            <Column
              title="Nhà cung cấp"
              key="supplier"
              render={(text, record) => record.supplier || "N/A"}
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
            <span className="text-lg font-semibold">
              Tổng tiền: {totalAmount.toLocaleString()}₫
            </span>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSaveReceipt}
            >
              Lưu phiếu nhập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBookReceipt;
