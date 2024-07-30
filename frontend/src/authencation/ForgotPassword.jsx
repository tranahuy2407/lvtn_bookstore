import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/forgotpassword', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6 py-48">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Quên mật khẩu?</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Nhớ mật khẩu của bạn?
              <a className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                Đăng nhập tại đây
              </a>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold ml-1 mb-2 dark:text-white">Địa chỉ email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                  <p className="hidden text-xs text-red-600 mt-2" id="email-error">Vui lòng nhập địa chỉ email hợp lệ để chúng tôi có thể liên lạc với bạn</p>
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

export default ForgotPassword;
