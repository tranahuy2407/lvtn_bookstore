import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AddAuthor = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const UPLOAD_PRESET = "yznfezyj"; // Replace with your Cloudinary preset
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmcfhbwbb/image/upload";

  const handleUploadImage = async (file) => {
    try {
      if (!file || !file.type.startsWith("image/")) {
        throw new Error("Bạn chỉ có thể tải lên ảnh!");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `Tác Giả/${form.getFieldValue("name")}`);

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
      setError(`Lỗi tải lên hình ảnh: ${error.message}`);
      message.error(`Tải lên hình ảnh thất bại: ${error.message}`);
      return null;
    }
  };

  const handleFinish = async (values) => {
    if (!imageFile) {
      setError("Vui lòng chọn một hình ảnh.");
      return;
    }

    const imageUrl = await handleUploadImage(imageFile);
    if (!imageUrl) return;

    try {
      const response = await axios.post("http://localhost:5000/api/addauthors", {
        ...values,
        image: imageUrl,
      });

      message.success(response.data.message);
      form.resetFields();
      setImageFile(null);
      setImageName("");
      setError("");

      setTimeout(() => {
        navigate("/admin/dashboard/authors");
      }, 1000);
    } catch (error) {
      message.error("Thêm không thành công");
      console.error("Error adding author:", error);
    }
  };

  const handleFileChange = (file) => {
    setImageFile(file);
    setImageName(file.name);
    return false;
  };

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">Thêm tác giả</strong>
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-3">
        <Form.Item
          label="Tên tác giả"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          rules={[{ required: true, message: "Vui lòng chọn một hình ảnh" }]}
        >
          <Upload beforeUpload={handleFileChange} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
          {imageName && <p className="mt-2 text-gray-700">Tệp đã chọn: {imageName}</p>}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddAuthor;
