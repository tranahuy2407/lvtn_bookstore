import React, { useState, useEffect, useContext } from 'react';
import { Card } from "flowbite-react";
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import GrayHeartIcon from '../assets/wishlist.png';
import RedHeartIcon from '../assets/wishlist-red.png';
import { UserContext } from '../authencation/UserContext';
import axios from 'axios';
import Pagination from '../shop/Panigation'; 

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorNames, setAuthorNames] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false); 
  const [showAllPublishers, setShowAllPublishers] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get("http://localhost:5000/api/products");
        setBooks(booksResponse.data);

        const categoriesResponse = await axios.get("http://localhost:5000/api/categories");
        setCategories(categoriesResponse.data);

        const authorsResponse = await axios.get("http://localhost:5000/api/authors");
        setAuthors(authorsResponse.data);

        const publishersResponse = await axios.get("http://localhost:5000/api/publishers");
        setPublishers(publishersResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user && user._id) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/favorite/${user._id}`);
          setFavorites(response.data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const fetchedAuthors = {};
      for (const book of books) {
        if (book.author) {
          try {
            const response = await axios.get(`http://localhost:5000/author/${book.author}`);
            fetchedAuthors[book.author] = response.data.name || 'Unknown Author';
          } catch (error) {
            console.error("Error fetching author data:", error);
            fetchedAuthors[book.author] = 'Unknown Author';
          }
        } else {
          fetchedAuthors[book.author] = 'Unknown Author';
        }
      }
      setAuthorNames(fetchedAuthors);
    };

    if (books.length > 0) {
      fetchAuthors();
    }
  }, [books]);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories(prev =>
      checked ? [...prev, value] : prev.filter(category => category !== value)
    );
  };

  const handlePublisherChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPublishers(prev =>
      checked ? [...prev, value] : prev.filter(publisher => publisher !== value)
    );
  };

  const toggleFavorite = async (bookId) => {
    const isCurrentlyFavorite = favorites.includes(bookId);
    const url = isCurrentlyFavorite ? 'http://localhost:5000/remove-favorite' : 'http://localhost:5000/add-favorite';

    try {
      if (isCurrentlyFavorite) {
        const response = await axios.delete(url, { data: { userId: user._id, bookId } });
        setFavorites(favorites.filter(id => id !== bookId));
      } else {
        const response = await axios.post(url, { userId: user._id, bookId });
        setFavorites([...favorites, bookId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (bookId) => favorites.includes(bookId);

  const filteredBooks = books.filter(book => {
    let categoryCondition = true;
    let publisherCondition = true;

    if (selectedCategories.length > 0) {
      categoryCondition = selectedCategories.some(selectedCategory => {
        return book.categories.includes(selectedCategory);
      });
    }

    if (selectedPublishers.length > 0) {
      publisherCondition = selectedPublishers.includes(book.publishers);
    }

    return categoryCondition && publisherCondition;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='mt-28 px-4 lg:px-24'>
      <div className="flex">
        <div className="w-1/5 mt-8 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Thể loại</h3>
            <ul className="space-y-2">
              {categories.slice(0, showAllCategories ? categories.length : 5).map(category => (
                <li key={category._id} className="flex items-center">
                  <label className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer">
                    <input
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                      className="mr-2 accent-blue-500"
                    />
                    {category.name}
                  </label>
                </li>
              ))}
              {categories.length > 5 && (
                <li>
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="text-blue-500 font-semibold hover:underline focus:outline-none"
                  >
                    {showAllCategories ? 'Thu gọn' : `Xem thêm (${categories.length - 5})`}
                  </button>
                </li>
              )}
            </ul>
          </div>

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
          <h2 className='text-5xl font-bold text-center text-gray-900'>Tất cả sách</h2>
          <div className='grid gap-8 my-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
            {currentBooks.length > 0 ? (
              currentBooks.map(book => (
                <Card key={book._id} className="relative rounded-lg shadow-md hover:shadow-xl">
                  {book.promotion_percent && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{book.promotion_percent}%
                    </div>
                  )}
                  <img src={book.images} alt={book.name} className="rounded-t-lg h-64 sm:h-72 object-contain" />
                  <img
                    src={isFavorite(book._id) ? RedHeartIcon : GrayHeartIcon}
                    className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                    alt="Heart Icon"
                    onClick={() => toggleFavorite(book._id)}
                    />
                    <div className="p-4 text-center">
                      <h5 className="text-xl font-semibold text-gray-900 mb-2">
                        {book.name}
                      </h5>
                      <p className="text-gray-500 italic mb-2">
                        {authorNames[book.author] || "Loading..."}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <span className="font-bold text-blue-600">
                          {book.promotion_price.toLocaleString()} VNĐ
                        </span>
                        <span className="text-gray-500 line-through ml-2">
                          {book.price.toLocaleString()} VNĐ
                        </span>
                      </p>
                      <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold mb-2' onClick={() => addToCart(book)}>
                        Thêm vào giỏ hàng
                      </button>
                      <Link to={`/book/${book._id}`} className='bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-semibold ml-2 mb-2'>
                        Chi tiết
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-gray-700 text-center">Không có sách nào phù hợp với bộ lọc đã chọn.</p>
              )}
            </div>
            {filteredBooks.length > booksPerPage && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
                  onPageChange={paginate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default Shop;
  
