import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../authencation/UserContext';
import { CartContext } from '../shop/CartContext';
import GrayHeartIcon from '../assets/wishlist.png';
import RedHeartIcon from '../assets/wishlist-red.png';

const Shop_By_Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [imageError, setImageError] = useState(false);
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorResponse = await axios.get(`http://localhost:5000/api/authors/${authorId}`);
        setAuthor(authorResponse.data);

        const booksResponse = await axios.get(`http://localhost:5000/books/by-author/${authorId}`);
        setBooks(booksResponse.data);
        
        if (user && user._id) {
          const favoritesResponse = await axios.get(`http://localhost:5000/favorite/${user._id}`);
          setFavorites(favoritesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authorId, user]);

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleFavorite = async (bookId) => {
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
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (bookId) => favorites.includes(bookId);

  return (
    <div className="p-4 border rounded-lg shadow-md py-28">
      <h1 className="text-3xl font-bold mb-6 text-center">Tác giả: {author?.name}</h1>
      <div className="flex mb-8">
        <div className="w-1/6">
          <img
            src={imageError ? '/path/to/placeholder-image.jpg' : author?.image}
            alt={author?.name}
            className="w-full h-auto rounded-lg"
            onError={handleImageError}
          />
        </div>
        <div className="w-2/3 pl-4">
          <h2 className="text-2xl font-bold mb-2">{author?.name}</h2>
          <p>{author?.description}</p>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Sách của {author?.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.length > 0 ? (
            books.map(book => (
              <div key={book._id} className="border rounded-lg p-4 shadow-sm">
                <img
                  src={book.images}
                  alt={book.name}
                  className="w-full h-auto rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold mb-1">{book.name}</h3>
                <div className="flex justify-between items-center">
                  <img
                    src={isFavorite(book._id) ? RedHeartIcon : GrayHeartIcon}
                    className="h-6 w-6 cursor-pointer"
                    alt="Heart Icon"
                    onClick={() => toggleFavorite(book._id)}
                  />
                  <button
                    onClick={() => addToCart(book)}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sách nào của tác giả này.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop_By_Author;
