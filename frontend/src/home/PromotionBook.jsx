import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6'; 

const PromotionBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); 

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/promotion/books');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Đã xảy ra lỗi khi lấy sách');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const displayedBooks = showAll ? books : books.slice(0, 10);

  return (
    <div className='container mx-auto my-16 px-4 lg:px-24'>
      <h2 className='text-5xl text-center font-bold text-black my-5'>Sách giảm giá sốc</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4'>
        {displayedBooks.map((book) => (
          <div key={book._id} className='relative bg-white shadow-md rounded-md overflow-hidden'>
            <Link to={`/book/${book._id}`}>
              <div className='h-64 flex items-center justify-center overflow-hidden bg-gray-200'>
                <img 
                  src={book.images || 'placeholder.jpg'} 
                  alt={book.name} 
                  className="object-contain h-full" 
                />
              </div>
              
              {book.promotion_percent && (
                <div className='absolute top-0 left-0 bg-red-500 text-white p-1 text-sm font-bold rounded-br-lg'>
                  - {book.promotion_percent}%
                </div>
              )}

              <div className='absolute top-3 right-3 bg-blue-300 hover:bg-black p-2 rounded'>
                <FaCartShopping className='w-4 h-4 text-white' />
              </div>

              <div className='p-4 text-center'>
                <h3 className='text-lg font-semibold text-gray-900'>{book.name}</h3>
              </div>
              
              <div className='p-4 text-center'>
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
          </div>
        ))}
      </div>
      
      <div className='text-center mt-8'>
        {books.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className='bg-blue-500 text-white py-2 px-4 rounded'
          >
            {showAll ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromotionBook;
