import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import { UserContext } from '../authencation/UserContext';
import RatingStar from '../components/RatingStart'; 

const PromotionBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(UserContext);

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

  const handleBookClick = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ userId: user._id })
      });

      if (!response.ok) {
        throw new Error('Failed to update click count');
      }
    } catch (error) {
      console.error('Error updating click count:', error);
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
    <div className='container mx-auto my-16 px-4 lg:px-28'>
      <h2 className='text-5xl text-center font-bold text-black my-5 py-10'>Sách giảm giá sốc</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4'>
        {displayedBooks.map((book) => (
          <div key={book._id} className='relative bg-white shadow-md rounded-md overflow-hidden flex flex-col'>
            <Link to={`/book/${book._id}`} onClick={() => handleBookClick(book._id)} className='flex-1'>
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
            </Link>

            <div className='p-4 text-center mt-auto'>
              <h3 className='text-lg font-semibold text-gray-900'>{book.name}</h3>
              <div className='my-2 flex justify-center'>
                <RatingStar bookId={book._id} currentRating={book.ratings[0]?.rating || 0} onRatingChange={() => {}} />
              </div>
              <div className='relative text-center'>
                {book.promotion_price < book.price ? (
                  <div className='flex justify-center items-center space-x-2'>
                    <p className="text-red-500 line-through">{book.price} VNĐ</p>
                    <p className="text-green-500 font-bold">{book.promotion_price} VNĐ</p>
                  </div>
                ) : (
                  <p className="text-green-500 font-bold">{book.price} VNĐ</p>
                )}
              </div>
            </div>
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
