import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddNews = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const UPLOAD_PRESET = "yznfezyj";
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload";

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `Tin tức/${file.name}`);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false,
      });

      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error(`Tải lên hình ảnh thất bại: ${error.message}`);
      return null;
    }
  };

  const handleFinish = async (values) => {
    setUploading(true);

    if (!imageFile) {
      message.error("Vui lòng chọn một hình ảnh.");
      setUploading(false);
      return;
    }

    // Convert status from string to number (0 or 1)
    const status = values.status === "Hiển thị" ? 1 : 0;

    const imageUrl = await handleUploadImage(imageFile);
    if (!imageUrl) {
      setUploading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/news", {
        ...values,
        status, // Include status as a number
        image: imageUrl,
      });

      message.success(response.data.message);
      form.resetFields();
      setImageFile(null);
      setImageName("");

      setTimeout(() => {
        navigate("/admin/dashboard/news");
      }, 1500);
    } catch (error) {
      message.error("Thêm không thành công");
      console.error("Error adding news:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (info) => {
    const { file } = info;
    if (file.status === "done") {
      setImageFile(file.originFileObj);
      setImageName(file.name);
    } else if (file.status === "error") {
      setImageFile(null);
      setImageName("");
    }
  };

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Thêm bài viết</strong>
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-3">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value="Hiển thị">Hiển thị</Option>
            <Option value="Ẩn">Ẩn</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Tác giả"
          name="author"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          rules={[{ required: true, message: "Vui lòng chọn một hình ảnh" }]}
        >
          <Upload
            beforeUpload={(file) => {
              setImageFile(file);
              setImageName(file.name);
              return false; // Prevent automatic upload
            }}
            onChange={handleFileChange}
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
          {imageName && <p className="mt-2 text-gray-700">Tệp đã chọn: {imageName}</p>}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploading}>
            {uploading ? 'Đang tải lên...' : 'Thêm'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNews;
