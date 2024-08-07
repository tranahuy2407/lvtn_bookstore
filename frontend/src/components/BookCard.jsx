import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';

const BookCard = ({ headline, books }) => {
  return (
    <div className='my-16 px-4 lg:px-24'>
      <h2 className='text-5xl text-center font-bold text-black my-5'>{headline}</h2>
      <div className='mt-12'>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper w-full h-full"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <Link to={`/book/${book._id}`}>
                <div className='relative'>
                  <img src={book.images} alt={book.name} className="w-full" />
                  
                  {book.promotion_percent && (
                    <div className='absolute top-0 left-0 bg-red-500 text-white p-1 text-sm font-bold rounded-br-lg'>
                      - {book.promotion_percent}% 
                    </div>
                  )}
                  
                  <div className='absolute top-3 right-3 bg-blue-300 hover:bg-black p-2 rounded'>
                    <FaCartShopping className='w-4 h-4 text-white' />
                  </div>
                </div>
                <div className='flex flex-col items-center text-center mt-4'>
                  <h3 className='text-lg font-semibold'>{book.name}</h3>
                  <p className='text-gray-500 italic'>
                    {book.author.length > 0 ? book.author.map((author, index) => (
                      <span key={index}>
                        {author.name}
                        {index < book.author.length - 1 && ', '}
                      </span>
                    )) : "Loading..."}
                  </p>
                </div>
                <div className='text-center mt-2'>
                  {book.promotion_price < book.price ? (
                    <p>
                      <span className="text-red-500 line-through">{book.price} VNĐ</span>{' '}
                      <span className="text-green-500 font-bold">{book.promotion_price} VNĐ</span>
                    </p>
                  ) : (
                    <p>{book.price} VNĐ</p>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BookCard;
