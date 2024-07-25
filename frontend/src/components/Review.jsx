import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Review = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);

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
                userName: 'Anonymous',
              };
            }
          })
        );

        setReviews(reviewsWithUsernames);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' ' + date.toLocaleTimeString('vi-VN');
  };

  return (
    <section className="py-12 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-start lg:gap-14 gap-7 inline-flex">
          <div className="w-full flex-col justify-start items-start gap-8 flex">
            {reviews.length > 0 ? (
              reviews.map(review => (
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
                      <div className="group justify-end items-center flex">
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm font-normal leading-snug">{review.comment || 'No comment'}</p>
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
            <div className="w-full relative flex justify-between gap-2 mt-6">
              <input type="text" className="w-full py-3 px-5 rounded-lg border border-gray-300 bg-white shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] focus:outline-none text-gray-900 placeholder-gray-400 text-lg font-normal leading-relaxed" placeholder="Nhập bình luận của bạn ..." />
              <a href="#" className="absolute right-6 top-[18px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_2063_2504)">
                    <path d="M10.0194 1.66699V5.6556C1.69526 5.6556 1.54178 14.4163 1.69573 18.3337C1.69573 16.4818 5.84659 10.0003 10.0194 10.6414V14.63L18.3332 8.14847L10.0194 1.66699Z" stroke="#111827" strokeWidth="1.6" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2063_2504">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
