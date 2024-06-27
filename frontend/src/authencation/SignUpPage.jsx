import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';
import axios from "axios";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [successAlert, setSuccessAlert] = useState(false); 
  const [errorAlert, setErrorAlert] = useState(false); 

  async function SignUp(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
        phone,
      });
      setSuccessAlert(true);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setTimeout(() => {
        setSuccessAlert(false); 
      }, 3000); 
    } catch (error) {
      setErrorAlert(true); 
      console.error(
        "Đăng ký thất bại:",
        error.response.data.msg || error.message
      );
      setTimeout(() => {
        setErrorAlert(false);
      }, 3000);
    }
  }

  return (
    <div className="mt-24 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Đăng ký</h1>
        <form className="max-w-md mx-auto" onSubmit={SignUp}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="block w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập mật khẩu của bạn"
            className="block w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập tên của bạn"
            className="block w-full mb-4 p-2 border rounded"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Nhập số điện thoại của bạn"
            className="block w-full mb-4 p-2 border rounded"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
          />
          <button
            className="primary w-full mb-4 py-2 bg-blue-600 text-white rounded"
            id="login"
          >
            Đăng ký
          </button>
          <div className="text-center py-2 text-gray-500 font-bold">
            Nếu bạn đã có tài khoản?
            <Link
              to={"/login"}
              className="underline text-brown hover:text-red-500"
            >
              {" "}
              Đăng nhập tại đây!
            </Link>
          </div>
        </form>
        {successAlert && (
          <Alert variant="filled" severity="success">
            Đăng ký thành công
          </Alert>
        )}
        {errorAlert && (
          <Alert variant="filled" severity="error">
            Đăng ký thất bại! Vui lòng thử lại!
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
