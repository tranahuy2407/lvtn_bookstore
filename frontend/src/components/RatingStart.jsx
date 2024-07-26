import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from "../authencation/UserContext";

const RatingStar = ({ bookId, currentRating, onRatingChange }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const { user } = useContext(UserContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleStarClick = async (newRating) => {
    if (!user) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để đánh giá");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/rate/${bookId}`, {
        userId: user._id,
        rating: newRating
      });

      if (response.status === 200) {
        setRating(newRating);
        onRatingChange(newRating);
        setError(null);
      } else {
        setError(response.data.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const closeErrorDialog = () => {
    setError(null);
  };

  return (
    <div className="flex items-center">
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-600 font-bold">{error}</p>
            <button
              onClick={closeErrorDialog}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleStarClick(star)}
          className={`w-8 h-8 ms-1 cursor-pointer ${star <= rating ? 'text-yellow-300' : 'text-gray-300'}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
        </svg>
      ))}
    </div>
  );
};

export default RatingStar;
