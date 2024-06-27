import React, { useContext, useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import axios from 'axios';

const SingleBook = () => {
  const { addToCart } = useContext(CartContext);
  const { _id, name, images, price, promotion_price, description, promotion_percent, author } = useLoaderData();
  const [authorName, setAuthorName] = useState("");
  const [categoriesData, setCategoriesData] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorResponse = await axios.get(`http://localhost:5000/author/${author}`);
        setAuthorName(authorResponse.data.name || 'Unknown Author');

        const categoriesResponse = await axios.get(`http://localhost:5000/api/product-categories/${_id}`);
        setCategoriesData(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (_id) {
      fetchData();
    }
  }, [_id, author]);

  const handleBuyNow = () => {
    addToCart({ _id, name, price, promotion_price, images });
    navigate('/cart'); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-8">Chi tiết sản phẩm</h1>
      
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
          <div className="max-w-[400px] mx-auto">
            <img
              src={images}
              className="w-full h-full object-cover rounded"
              alt={name}
            />
          </div>
        </div>
        
        <div className="lg:w-1/2 lg:pl-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="badge badge-secondary text-xs">New</span>
              <h2 className="text-2xl font-bold ml-2">{name}</h2>
              {promotion_percent > 0 && (
                <div className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                  -{promotion_percent}%
                </div>
              )}
            </div>
            
            <div className="text-xl font-semibold text-black">
              <div className="flex items-center">
                <span className="text-gray-500">Giá gốc:</span> 
                <div className="ml-2">
                  <span className="line-through text-gray-500">{price.toLocaleString()} VNĐ</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500">Giá giảm giá:</span> 
                <div className="ml-2">
                  <span className="text-red-500">{promotion_price.toLocaleString()} VNĐ</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <p><span className="font-semibold">Tác giả:</span> {authorName}</p>
              <p><span className="font-semibold">Thể loại: </span> 
                {categoriesData && categoriesData.map((category, index) => (
                
                  <span key={category._id}>
                    {index > 0 && ', '}
                    {category.name}
                  </span>
                ))}
              </p>
            </div>
            
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addToCart({ _id, name, price, promotion_price, images })}
            >
              Thêm vào giỏ hàng
            </button>

            <button
              type="button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
  
            <div className="tabs pt-8">
              <button className="tab tab-lg tab-lifted tab-active">Mô tả</button>
              <button className="tab tab-lg tab-lifted text-gray-400">Đánh giá của khách hàng</button>
            </div>
            
            <div className="text-black">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
