import React, { useContext, useState } from "react";
import axios from "axios";
import ReturnPolicy from "./ReturnPolicy";
import { UserContext } from "../authencation/UserContext";
import { Select, Button, message } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ReturnBook = () => {
  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/upload";
  const [orderCode, setOrderCode] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]); // This should be an array of IDs
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); 

  const fetchOrderDetails = async () => {
    if (!orderCode || !user?._id) return;
    const cleanedOrderCode = orderCode.replace("#", "");
    try {
      const response = await axios.get("http://localhost:5000/orders/code", {
        params: { orderCode: cleanedOrderCode, userId: user._id },
      });

      if (response.data.message) {
        setResponseMessage(response.data.message);
        setOrderDetails(null);
      } else {
        setOrderDetails(response.data);
        setSelectedBooks([]); // Clear selection if fetching a new order
        setResponseMessage("");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setResponseMessage("Có lỗi xảy ra khi tìm kiếm thông tin đơn hàng.");
    }
  };

  const handleSearchClick = () => {
    fetchOrderDetails();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `Đổi trả/${orderCode}`);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
      });

      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error('Failed to upload PDF');
      }
    } catch (error) {
      message.error(`PDF upload failed: ${error.message}`);
      console.error('Error uploading PDF:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (selectedBooks.length === 0) {
      message.error("Vui lòng chọn ít nhất một sách để đổi.");
      return;
    }
  
    let uploadedFileUrl = '';
    if (file) {
      try {
        uploadedFileUrl = await handleUploadPDF(file);
      } catch (uploadError) {
        console.error("Error uploading PDF file:", uploadError);
        return;
      }
    }
  
    setResponseMessage("");
  
    const bookIdMap = orderDetails.books.reduce((acc, book) => {
      acc[book._id] = book.book._id; 
      return acc;
    }, {});
  
    const transformedSelectedBooks = selectedBooks.map(id => bookIdMap[id] || id);
  
    console.log("Transformed Selected Books:", transformedSelectedBooks);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/return",
        {
          returnReason,
          selectedBooks: transformedSelectedBooks,
          fileUrl: uploadedFileUrl,
          userId: user._id,
          orderCode: orderCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      setResponseMessage("Yêu cầu đổi trả đã được gửi thành công!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting return request:", error);
      setResponseMessage("Có lỗi xảy ra khi gửi yêu cầu đổi trả.");
    }
  };
  
  
  const handleViewRequestsClick = () => {
    navigate(`/requests/${user._id}`); 
  };

  return (
    <section className="py-32">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="relative mb-6">
          <Button
            type="primary"
            onClick={handleViewRequestsClick}
            className="absolute top-0 right-0 mt-4 mr-4"
          >
            Xem danh sách yêu cầu
          </Button>
        </div>
        <div className="space-y-5 sm:text-center sm:max-w-md sm:mx-auto">
          <h1 className="text-gray-800 text-3xl font-extrabold sm:text-4xl">
            Đổi Trả Sách
          </h1>
          <p className="text-gray-600">
            Nhập thông tin sách và lý do đổi trả dưới đây
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="orderCode" className="block text-gray-700">
                  Mã đơn hàng
                </label>
                <input
                  type="text"
                  id="orderCode"
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearchClick}
                className="mt-6 py-2 px-4 font-medium text-sm text-center text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow"
              >
                Tìm kiếm
              </Button>
            </div>
            {orderDetails && (
              <>
                <div>
                  <label htmlFor="customerName" className="block text-gray-700">
                    Tên người đặt
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={orderDetails.name}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={orderDetails.phone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="bookSelect" className="block text-gray-700">
                    Chọn sách đổi
                  </label>
             <Select
              mode="multiple"
              id="bookSelect"
              value={selectedBooks}
              onChange={(values) => setSelectedBooks(values)}
              className="w-full"
              placeholder="Chọn sách"
            >
              {orderDetails.books.map((book) => (
                <Option key={book._id} value={book._id}>
                  {book.book.name}
                </Option>
              ))}
            </Select>
                </div>
              </>
            )}
            <div>
              <label htmlFor="returnReason" className="block text-gray-700">
                Lý do đổi trả
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={returnReason}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setReturnReason(data);
                }}
                config={{
                  placeholder: 'Nhập lý do đổi trả ở đây...',
                }}
              />
            </div>
            <div className="relative">
              <label htmlFor="fileUpload" className="block text-gray-700">
                Tải hóa đơn
              </label>
              <input
                type="file"
                id="fileUpload"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-700 text-sm"
              >
                {file ? file.name : "Chọn tệp PDF"}
              </button>
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow"
            >
              Gửi yêu cầu
            </Button>
            {responseMessage && (
              <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
            )}
          </form>
        </div>
      </div>
      <ReturnPolicy />
    </section>
  );
};

export default ReturnBook;
