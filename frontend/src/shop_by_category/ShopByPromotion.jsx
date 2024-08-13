import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Card } from 'flowbite-react';
import RedHeartIcon from '../assets/wishlist-red.png';
import GrayHeartIcon from '../assets/wishlist.png';
import { CartContext } from '../shop/CartContext';
import { UserContext } from '../authencation/UserContext';

const ShopByPromotion = () => {
  const [promotion, setPromotion] = useState(null);
  const [books, setBooks] = useState([]);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/programs/${id}`);
        setPromotion(response.data);
    
        const bookIds = response.data.promotions.flatMap(promo => promo.books);
        const uniqueBookIds = [...new Set(bookIds)];
        console.log('Unique Book IDs:', uniqueBookIds); 
        const bookRequests = uniqueBookIds.map(bookId =>
          axios.get(`http://localhost:5000/api/products/${bookId}`)
            .catch(err => {
              console.error(`Failed to fetch book with ID ${bookId}:`, err);
              return null; 
            })
        );
        const bookResponses = await Promise.all(bookRequests);
        setBooks(bookResponses.filter(response => response !== null).map(response => response.data));
        
      } catch (error) {
        console.error('Error fetching promotion:', error);
        setError('Error fetching promotion data.');
      }
    };
    
    fetchPromotion();
  }, [id]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`http://localhost:5000/favorite/${user._id}`);
          setFavorites(response.data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (bookId) => {
    if (!user || !user._id) return;

    const isCurrentlyFavorite = favorites.includes(bookId);
    const url = isCurrentlyFavorite ? 'http://localhost:5000/remove-favorite' : 'http://localhost:5000/add-favorite';

    try {
      if (isCurrentlyFavorite) {
        await axios.delete(url, { data: { userId: user._id, bookId } });
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        await axios.post(url, { userId: user._id, bookId });
        setFavorites([...favorites, bookId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (bookId) => favorites.includes(bookId);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Mã khuyến mãi đã được sao chép!');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
        alert('Không thể sao chép mã khuyến mãi.');
      });
  };

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!promotion) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section
        className="overflow-hidden bg-cover bg-no-repeat bg-center mt-20 h-[500px]"
        style={{ backgroundImage: `url(${promotion.image || 'default-image-url'})` }}
      >
        <div className="bg-black/50 p-8 md:p-12 lg:px-16 lg:py-24 h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {promotion.name || 'Default Name'}
            </h2>
            <p
              className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-2xl md:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: promotion.description || 'Default description' }}
            />
          </div>
        </div>
      </section>

      <div className="max-w-full mx-auto my-4 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {promotion.promotions.map((promo) => (
            <div
              key={promo._id}
              className={`border-4 border-dotted rounded-lg flex flex-col overflow-hidden ${
                promo.limit === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <img
                src={promo.image || 'default-promo-image-url'}
                alt={promo.code || 'Promo'}
                className="w-full h-48 object-cover"
              />
              <div className="bg-white p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-xl">
                    {promo.type === 'money'
                      ? `${promo.value || 'Value'} VNĐ OFF`
                      : promo.type === 'percent'
                        ? `${promo.value || 'Value'}% OFF`
                        : 'Miễn phí vận chuyển'}
                  </h2>
                  <p className="mt-2">{promo.description || 'Default promo description'}</p>
                  {promo.limit !== undefined && (
                    <p className="text-gray-600 mt-2">
                      Còn lại: {promo.limit} {promo.limit === 0 ? '(Hết)' : ''}
                    </p>
                  )}
                </div>
                <div className="bg-gray-200 p-4 mt-4 flex items-center">
                  <p className="flex-1">
                    Mã: <span className="bg-gray-300 p-1 rounded">{promo.code || 'Default Code'}</span>
                  </p>
                  {promo.limit > 0 && (
                    <button
                      onClick={() => handleCopyCode(promo.code || 'Default Code')}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Sao chép mã
                    </button>
                  )}
                </div>
                <p className="text-red-600">
                  Ngày hết hạn: {promo.end_day ? new Date(promo.end_day).toLocaleDateString() : 'Default Expiry Date'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-8">
          <h3 className="font-bold text-7xl text-center py-12">Các sách trong chương trình khuyến mãi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book) => (
              <Card key={book._id} className="relative rounded-lg shadow-md hover:shadow-xl">
                {book.promotion_percent && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{book.promotion_percent}%
                  </div>
                )}
                <img
                  src={book.images || 'default-book-image-url'}
                  alt={book.name || 'Book'}
                  className="rounded-t-lg h-64 sm:h-72 object-contain"
                />
                <img
                  src={isFavorite(book._id) ? RedHeartIcon : GrayHeartIcon}
                  className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                  alt="Heart Icon"
                  onClick={() => toggleFavorite(book._id)}
                />
                <div className="p-4 text-center">
                  <h5 className="text-lg font-semibold text-gray-800">{book.name || 'Default Book Name'}</h5>
                  {book.promotion_price ? (
                    <p className="text-gray-700">
                      <span className="font-bold text-blue-600">
                        {book.promotion_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </span>
                      <span className="text-gray-500 line-through ml-2">
                        {book.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      {book.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>
                  )}
                  <div className="mt-4 flex justify-center space-x-2">
                    <Link
                      to={`/book/${book._id}`}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => addToCart(book)}
                      className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopByPromotion;
