import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Card } from "flowbite-react";
import Pagination from "../shop/Panigation";
import { UserContext } from "../authencation/UserContext";
import { CartContext } from "../shop/CartContext";
import GrayHeartIcon from "../assets/wishlist.png";
import RedHeartIcon from "../assets/wishlist-red.png";

const Search = () => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [showAllPublishers, setShowAllPublishers] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [query]);

  useEffect(() => {
    if (user && user._id) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(categoriesResponse.data);

        const publishersResponse = await axios.get(
          "http://localhost:5000/api/publishers"
        );
        setPublishers(publishersResponse.data);
      } catch (error) {
        console.error("Error fetching filters data:", error);
      }
    };

    fetchFiltersData();
  }, []);

  const handleSearch = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/search/${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/favorite/${user._id}`
      );
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (productId) => {
    const isCurrentlyFavorite = favorites.includes(productId);
    const url = isCurrentlyFavorite
      ? `http://localhost:5000/remove-favorite`
      : `http://localhost:5000/add-favorite`;

    try {
      if (isCurrentlyFavorite) {
        await axios.delete(url, {
          data: { userId: user._id, bookId: productId },
        });
        setFavorites(favorites.filter((id) => id !== productId));
      } else {
        await axios.post(url, { userId: user._id, bookId: productId });
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (productId) => favorites.includes(productId);

  const handlePublisherChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPublishers((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((publisher) => publisher !== value)
    );
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((category) => category !== value)
    );
  };

  const filteredBooks = searchResults.filter((product) => {
    let publisherCondition = true;
    let categoryCondition = true;

    if (selectedPublishers.length > 0) {
      publisherCondition = selectedPublishers.includes(product.publishers);
    }

    if (selectedCategories.length > 0) {
      categoryCondition = product.categories.some((category) =>
        selectedCategories.includes(category)
      );
    }

    return publisherCondition && categoryCondition;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const shouldShowCategoryButtons = categories.length > 5 || showAllCategories;
  const shouldShowPublisherButtons = publishers.length > 5 || showAllPublishers;

  return (
    <div className="mt-28 px-4 lg:px-24 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        Kết quả tìm kiếm cho: "{searchQuery}" ({filteredBooks.length} sản phẩm)
      </h2>

      <div className="flex w-full">
        <div className="w-1/5 mt-8 space-y-4">
          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              Lọc theo Nhà xuất bản
            </h3>
            {publishers
              .slice(0, showAllPublishers ? publishers.length : 5)
              .map((publisher) => (
                <div key={publisher._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={publisher._id}
                    value={publisher._id}
                    checked={selectedPublishers.includes(publisher._id)}
                    onChange={handlePublisherChange}
                    className="mr-2"
                  />
                  <label htmlFor={publisher._id}>{publisher.name}</label>
                </div>
              ))}
            {publishers.length > 5 && (
              <button
                onClick={() => setShowAllPublishers(!showAllPublishers)}
                className="text-blue-500 mt-2"
              >
                {showAllPublishers ? "Ẩn bớt" : "Xem thêm"}
              </button>
            )}
          </div>

          <div className="border p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Lọc theo Thể loại</h3>
            {categories
              .slice(0, showAllCategories ? categories.length : 5)
              .map((category) => (
                <div key={category._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={category._id}
                    value={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={handleCategoryChange}
                    className="mr-2"
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
            {categories.length > 5 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-blue-500 mt-2"
              >
                {showAllCategories ? "Ẩn bớt" : "Xem thêm"}
              </button>
            )}
          </div>
        </div>

        <div className="w-4/5">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
            {currentBooks.length > 0 ? (
              currentBooks.map((product) => (
                <Card
                  key={product._id}
                  className="relative rounded-lg shadow-md hover:shadow-xl"
                >
                  {product.promotion_percent && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      - {product.promotion_percent}%
                    </div>
                  )}
                  <img
                    src={product.images}
                    alt={product.name}
                    className="rounded-t-lg h-64 sm:h-72 object-contain"
                  />
                  <img
                    src={isFavorite(product._id) ? RedHeartIcon : GrayHeartIcon}
                    className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                    alt="Heart Icon"
                    onClick={() => toggleFavorite(product._id)}
                  />
                  <div className="p-4 text-center">
                    <h5 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h5>
                    <p className="text-gray-500 italic mb-2">
                      Tác giả:{" "}
                      {product.author && product.author.length > 0
                        ? product.author.map((author) => author.name).join(", ")
                        : "Unknown Author"}
                    </p>
                    <p className="text-gray-700 mb-2">
                      {product.promotion_price ? (
                        <>
                          <span className="font-bold text-blue-600">
                            {product.promotion_price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <span className="text-gray-500 line-through ml-2">
                            {product.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-blue-600">
                          {product.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold mb-2"
                        onClick={() => addToCart(product)}
                      >
                        Thêm vào giỏ
                      </button>
                      <Link
                        to={`/book/${product._id}`}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-semibold mb-2"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Không tìm thấy sản phẩm nào.
              </p>
            )}
          </div>
        </div>
      </div>
      {filteredBooks.length > booksPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredBooks.length / booksPerPage)}
              paginate={paginate}
            />
      )}
    </div>
  );
};

export default Search;
