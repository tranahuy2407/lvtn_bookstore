import React, { useState, useEffect, useContext } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from './CartContext';
import BookCard from '../components/BookCard';
import Reviews from '../components/Review';
import RatingStart from '../components/RatingStart';

const SingleBook = () => {
  const { addToCart } = useContext(CartContext);
  const { _id, name, images, price, promotion_price, description, promotion_percent, author, quantity } = useLoaderData();
  const [authorName, setAuthorName] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorResponse = await axios.get(`http://localhost:5000/author/${author}`);
        setAuthorName(authorResponse.data.name);
        const categoriesResponse = await axios.get(`http://localhost:5000/api/product-categories/${_id}`);
        setCategoriesData(categoriesResponse.data);
        const relatedResponse = await axios.get(`http://localhost:5000/api/related-books/${_id}`);
        setRelatedBooks(relatedResponse.data);
        const ratingResponse = await axios.get(`http://localhost:5000/api/average-rating/${_id}`);
        setAverageRating(ratingResponse.data.averageRating);
        const commentsResponse = await axios.get(`http://localhost:5000/${_id}/comments`);
        setCommentsCount(commentsResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (_id) {
      fetchData();
    }
  }, [_id, author]);

  const handleBuyNow = () => {
    addToCart({ _id, name, price, promotion_price, images });
    navigate('/cart'); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold text-center my-8">Chi tiết sản phẩm</h1>
      
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
          <div className="max-w-[400px] mx-auto">
            <img
              src={images}
              className="w-full h-full object-cover rounded"
              alt={name}
            />
            <div className="mt-4 mb-8 flex justify-center">
              <RatingStart bookId={_id} currentRating={averageRating} onRatingChange={setAverageRating} />
            </div>
            <div className="flex justify-center items-center mt-2">
              <svg className="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
              </svg>
              <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">{averageRating ? averageRating.toFixed(2) : 'N/A'}</p>
              <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
              <a href="#" className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">{commentsCount} lượt đánh giá</a>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 lg:pl-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="badge badge-secondary text-xs">New</span>
              <h2 className="text-2xl font-bold ml-2">{name}</h2>
              {promotion_percent > 0 && (
                <div className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                  -{promotion_percent}%
                </div>
              )}
            </div>
            
            <div className="text-xl font-semibold text-black">
              <div className="flex items-center">
                <span className="text-gray-500">Giá gốc:</span> 
                <div className="ml-2">
                  <span className="line-through text-gray-500">{price.toLocaleString()} VNĐ</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500">Giá giảm giá:</span> 
                <div className="ml-2">
                  <span className="text-red-500">{promotion_price.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <p><span className="font-semibold">Tác giả:</span> {authorName}</p>
              <p><span className="font-semibold">Thể loại: </span> 
                {categoriesData && categoriesData.map((category, index) => (
                  <span key={category._id}>
                    {index > 0 && ', '}
                    {category.name}
                  </span>
                ))}
              </p>
            </div>
            
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addToCart({ _id, name, price, promotion_price, images, quantity })}
            >
              Thêm vào giỏ hàng
            </button>

            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
  
            <div className="tabs pt-8">
              <button 
                className={`tab tab-lg tab-lifted ${activeTab === 'description' ? 'tab-active bg-red-500 text-white' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả
              </button>
              <button 
                className={`tab tab-lg tab-lifted ${activeTab === 'reviews' ? 'tab-active bg-red-500 text-white' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá của khách hàng
              </button>
            </div>
            
            <div className="text-black mt-4">
              {activeTab === 'description' && <p>{description}</p>}
              {activeTab === 'reviews' && <Reviews bookId={_id} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <BookCard headline="Sản phẩm liên quan" books={relatedBooks} />
      </div>
    </div>
  );
};

export default SingleBook;
