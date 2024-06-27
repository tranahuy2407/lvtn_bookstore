import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from 'axios'; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  async function handleLogin(ev) {
    ev.preventDefault();
    try{
      const {data} = await axios.post("http://localhost:5000/api/signin" ,{email,password});
      setUser(data);
      alert('Đăng nhập thành công');
      setRedirect(true);
    }catch{
      alert('Đăng nhập thất bại');
    }
   
  }
  if(redirect){
    return <Navigate to= '/' />
  }
  return (
    <div className="mt-24 grow flex items-center justify-around ">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Đăng nhập</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input type="email"
           placeholder="Nhập email của bạn"
           value={email}
           onChange={(ev) => setEmail(ev.target.value)}>
           </input>
          <input type="password" 
          placeholder="Nhập mật khẩu của bạn"
           value={password} 
           onChange={(ev) => setPassword(ev.target.value)}
           ></input>
          <button className="primary" id="login">
            Đăng nhập
          </button>
          <div className="text-center py-2 text-gray-500 font-bold ">
            Nếu bạn chưa có tài khoản ?{" "}
            <Link
              to={"/signup"}
              className="underline text-brown hover:text-red-500"
            >
              {" "}
              Đăng ký tại đây!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
