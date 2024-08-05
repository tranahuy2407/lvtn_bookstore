import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../authencation/UserContext";
import { Link } from 'react-router-dom';

const Review = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [showAll, setShowAll] = useState(false); 
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${bookId}/comments`);
        const reviewsData = response.data;
        const reviewsWithUsernames = await Promise.all(
          reviewsData.map(async review => {
            try {
              const userResponse = await axios.get(`http://localhost:5000/api/getusername/${review.userId}`);
              return {
                ...review,
                userName: userResponse.data.name,
              };
            } catch (error) {
              console.error(`Error fetching username for userId ${review.userId}:`, error);
              return {
                ...review,
                userName: 'No Name',
              };
            }
          })
        );

        setReviews(reviewsWithUsernames);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError('Có lỗi xảy ra khi tải đánh giá.');
      }
    };

    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      setError('Bạn cần đăng nhập để bình luận.');
      return;
    }
  
    if (!comment.trim()) {
      setError('Bình luận không thể để trống.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/${bookId}/comments`, {
        userId: user._id,
        content: comment
      });
  
      const newComment = response.data;
      setReviews(prevReviews => [
        ...prevReviews,
        {
          ...newComment,
          userName: user.name, 
          createAt: new Date().toISOString() 
        }
      ]);
      setComment(''); 
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
      setError('Bạn chưa mua sách này!.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString('vi-VN');
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  const closeErrorDialog = () => {
    setError(null);
  };

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-start lg:gap-14 gap-7 inline-flex">
          <div className="w-full flex-col justify-start items-start gap-8 flex">
            {reviews.length > 0 ? (
              reviews.slice(0, showAll ? reviews.length : 2).map(review => (
                <div key={review._id} className="w-full lg:p-8 p-5 bg-white rounded-3xl border border-gray-200 flex-col justify-start items-start flex">
                  <div className="w-full flex-col justify-start items-start gap-3.5 flex">
                    <div className="w-full justify-between items-center inline-flex">
                      <div className="justify-start items-center gap-2.5 flex">
                        <div className="w-10 h-10 bg-stone-300 rounded-full justify-start items-start gap-2.5 flex">
                          <svg className="w-10 h-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            <path d="M4 21C4 16.4774 7.47715 13 12 13C16.5228 13 20 16.4774 20 21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                          <h5 className="text-gray-900 text-sm font-semibold leading-snug">{review.userName || 'No Name'}</h5>
                          <h6 className="text-gray-500 text-xs font-normal leading-5">
                            {formatDate(review.createAt)}
                          </h6>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm font-normal leading-snug">{review.comments[0] || 'No comment'}</p>
                    {review.reply && (
                      <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                        <h6 className="text-gray-800 text-sm font-semibold">Admin Reply:</h6>
                        <p className="text-gray-600 text-sm">{review.reply}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào.</p>
            )}
            {!showAll && reviews.length > 2 && (
              <button
                onClick={handleShowMore}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Xem thêm
              </button>
            )}
            {showAll && reviews.length > 2 && (
              <button
                onClick={handleShowLess}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Thu gọn
              </button>
            )}
            <div className="w-full relative flex justify-between gap-2 mt-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="w-10 h-10 bg-stone-300 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M4 21C4 16.4774 7.47715 13 12 13C16.5228 13 20 16.4774 20 21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <span className="text-gray-900 text-sm font-semibold">{user.name}</span>
                  </div>
                  <input
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                    className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed"
                    placeholder="Nhập bình luận của bạn ..."
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Gửi
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <p className="text-gray-500">Bạn chưa đăng nhập. Vui lòng đăng nhập để bình luận.</p>
                  <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Đăng nhập</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    </section>
  );
};

export default Review;
