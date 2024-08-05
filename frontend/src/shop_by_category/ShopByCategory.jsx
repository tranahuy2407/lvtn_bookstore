import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card } from 'flowbite-react';
import { Link, useParams } from 'react-router-dom';
import GrayHeartIcon from '../assets/wishlist.png';
import RedHeartIcon from '../assets/wishlist-red.png';
import { UserContext } from '../authencation/UserContext';
import { CartContext } from '../shop/CartContext';
import Pagination from '../shop/Panigation';

const ShopByCategory = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);
  const [showAllPublishers, setShowAllPublishers] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get(`http://localhost:5000/api/books-by-category/${id}`);
        setBooks(booksResponse.data);
  
        const categoriesResponse = await axios.get(`http://localhost:5000/api/category/${id}`);
        setCategoryName(categoriesResponse.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (id) {
      fetchData();
    }
  }, [id]);


  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/publishers');
        setPublishers(response.data);
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    };

    fetchPublishers();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/favorite/${user._id}`);
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (user && user._id) {
      fetchFavorites();
    }
  }, [user]);

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

  const handlePublisherChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPublishers((prev) =>
      checked ? [...prev, value] : prev.filter((publisher) => publisher !== value)
    );
  };

  const filteredBooks = books.filter((book) => {
    if (selectedPublishers.length === 0) return true;
    return selectedPublishers.includes(book.publishers);
  });

 
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBookClick = async (bookId) => {
    if (user && user._id) {
      try {
        await axios.post(`http://localhost:5000/api/books/${bookId}/counter`, {
          userId: user._id
        });
      } catch (error) {
        console.error("Error updating book click count:", error);
      }
    }
  };

  return (
    <div className="mt-28 px-4 lg:px-24 flex">
      <div className="w-1/4 pr-8">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Nhà xuất bản</h3>
          <ul className="space-y-2">
            {publishers.slice(0, showAllPublishers ? publishers.length : 5).map(publisher => (
              <li key={publisher._id} className="flex items-center">
                <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                  <input
                    type="checkbox"
                    value={publisher._id}
                    onChange={handlePublisherChange}
                    className="mr-2 accent-blue-500"
                    checked={selectedPublishers.includes(publisher._id)}
                  />
                  {publisher.name}
                </label>
              </li>
            ))}
            {publishers.length > 5 && (
              <li>
                <button
                  onClick={() => setShowAllPublishers(!showAllPublishers)}
                  className="text-blue-500 font-semibold hover:underline focus:outline-none"
                >
                  {showAllPublishers ? 'Thu gọn' : `Xem thêm (${publishers.length - 5})`}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="w-4/5">
        <h2 className="text-2xl font-bold mb-4">Danh mục {categoryName}</h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {currentBooks.map(product => (
            <Card key={product._id} className="relative rounded-lg shadow-md hover:shadow-xl">
              {product.promotion_percent && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  -{product.promotion_percent}%
                </div>
              )}
              <img src={product.images} alt={product.name} className="rounded-t-lg h-64 sm:h-72 object-contain" />
              <img
                src={isFavorite(product._id) ? RedHeartIcon : GrayHeartIcon}
                className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                alt="Heart Icon"
                onClick={() => toggleFavorite(product._id)}
              />
              <div className="p-4 text-center">
                <h5 className="text-lg font-semibold text-gray-800">{product.name}</h5>
                {product.promotion_price ? (
                  <p className="text-gray-700">
                    <span className="font-bold text-blue-600">
                      {product.promotion_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <span className="text-gray-500 line-through ml-2">
                      {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                )}
                <div className="mt-4 flex justify-center space-x-2">
                  <Link
                    to={`/book/${product._id}`}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    onClick={() => handleBookClick(product._id)}
                  >
                    Xem chi tiết
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination
            booksPerPage={booksPerPage}
            totalBooks={filteredBooks.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
