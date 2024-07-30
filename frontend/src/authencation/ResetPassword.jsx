import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams(); 
  console.log('Reset token:', token); 
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/resetpassword', {
        token,
        newPassword
      });
      setMessage(response.data.msg); 
      setError('');
      navigate('/login');
    } catch (error) {
      setMessage('');
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6 py-48">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Đặt lại mật khẩu</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Vui lòng nhập mật khẩu mới của bạn và xác nhận mật khẩu để hoàn tất quá trình đặt lại mật khẩu.
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="new-password"
                      name="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="new-password-error"
                    />
                  </div>
                  <p className="hidden text-xs text-red-600 mt-2" id="new-password-error">Vui lòng nhập mật khẩu mới của bạn</p>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="confirm-password-error"
                    />
                  </div>
                  <p className="hidden text-xs text-red-600 mt-2" id="confirm-password-error">Vui lòng xác nhận mật khẩu mới của bạn</p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Đặt lại mật khẩu
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-center text-gray-800 dark:text-white">{message}</p>}
            {error && <p className="mt-4 text-center text-red-600 dark:text-red-400">{error}</p>}
          </div>
        </div>
      </div>

      <p className="mt-3 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
        <a className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="#">
          Liên hệ với chúng tôi!
        </a>
      </p>
    </main>
  );
};

export default ResetPassword;
