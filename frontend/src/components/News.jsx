import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/news'); 
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchPosts();
  }, []);

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <section className="py-32">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="space-y-5 sm:text-center sm:max-w-md sm:mx-auto">
          <h1 className="text-gray-800 text-3xl font-extrabold sm:text-4xl">Bài đăng mới nhất</h1>
          <p className="text-gray-600">Đăng ký để nhận bài đăng sớm nhất</p>
          <form onSubmit={(e) => e.preventDefault()} className="items-center justify-center gap-3 sm:flex">
            <div className="relative">
              <svg
                className="w-6 h-6 text-gray-400 absolute left-40 inset-y-0 my-auto" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <input
                type="text"
                placeholder="Nhập email của bạn"
                className="w-full pl-10 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg sm:max-w-xs"
              />
            </div>
            <button className="block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow sm:mt-0 sm:w-auto">
              Đăng ký
            </button>
          </form>
        </div>
        <ul className="grid gap-x-8 gap-y-10 mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((item) => (
            <li className="w-full mx-auto group sm:max-w-sm" key={item._id}>
              <a href="#">
                <div className="relative w-full h-48">
                  <img
                    src={item.image || 'default-image-url'} 
                    loading="lazy"
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <span className="block text-indigo-600 text-sm">
                    {new Date(item.createAt).toLocaleDateString()}
                  </span>
                  <h3 className="text-lg text-gray-800 duration-150 group-hover:text-indigo-600 font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm duration-150 group-hover:text-gray-800">
                    {truncateContent(item.content, 100)} 
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default News;
