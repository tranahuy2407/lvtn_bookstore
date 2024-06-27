import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../authencation/UserContext';
import { CartContext } from '../shop/CartContext';
import { Link } from 'react-router-dom';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/favorite/${user._id}`);
        
        if (Array.isArray(response.data)) {
          const bookDetailsPromises = response.data.map(bookId => axios.get(`http://localhost:5000/api/products/${bookId}`));
          const booksDetailsResponses = await Promise.all(bookDetailsPromises);
          const booksDetails = booksDetailsResponses.map(res => res.data);
          setFavourites(booksDetails);
        } else {
          console.error('Unexpected data format:', response.data);
          setFavourites([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [user._id]);

  const removeFromFavourites = async (bookId) => {
    try {
      await axios.delete('http://localhost:5000/remove-favorite', {
        data: { userId: user._id, bookId }
      });
      
      setFavourites(favourites.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách yêu thích</h2>
        <span className="text-lg">Tổng số: {favourites.length} sản phẩm</span>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-center">Ảnh</th>
            <th className="py-2 px-4 border-b text-center">Tên</th>
            <th className="py-2 px-4 border-b text-center">Giá gốc</th>
            <th className="py-2 px-4 border-b text-center">Giá khuyến mãi</th>
            <th className="py-2 px-4 border-b text-center">Còn hàng</th>
            <th className="py-2 px-4 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {favourites.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">Không có sách yêu thích.</td>
            </tr>
          ) : (
            favourites.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border-b flex justify-center items-center">
                  <img src={book.images} alt={book.name} className="w-12 h-12 object-cover" />
                </td>
                <td className="py-2 px-4 border-b">{book.name}</td>
                <td className="py-2 px-4 border-b">{book.price ? book.price.toLocaleString() + ' VNĐ' : 'Không có'}</td>
                <td className="py-2 px-4 border-b">{book.promotion_price ? book.promotion_price.toLocaleString() + ' VNĐ' : 'Không có'}</td>
                <td className="py-2 px-4 border-b">{book.quantity > 0 ? 'Còn hàng' : 'Tạm hết hàng'}</td>
                <td className="py-2 px-4 border-b flex justify-center items-center space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => addToCart(book)}
                    disabled={book.quantity === 0} 
                  >
                    {book.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    onClick={() => removeFromFavourites(book._id)}
                  >
                    Xóa khỏi yêu thích
                  </button>
                  <Link
                    to={`/book/${book._id}`}
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Favourites;
