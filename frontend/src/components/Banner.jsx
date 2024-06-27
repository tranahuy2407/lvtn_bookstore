import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from "react-icons/bs";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'; 
import bannerPlaceholder from '../assets/promotion_1-6.jpg';
import axios from 'axios';

const Banner = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promotions');
        setPromotions(response.data.promotions);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };
    fetchPromotions();
  }, []);

  const placeholderImage = bannerPlaceholder;

  return (
    <div className="container py-24">
      <div className="grid xl:grid-cols-3 xl:grid-rows-2 gap-8">
        
        <div className="xl:col-span-2 xl:row-start-1 xl:row-end-[-1] relative">
          <Carousel
            showThumbs={false}
            autoPlay={true}
            infiniteLoop={true}
            showStatus={false}
            interval={3000}
            stopOnHover={true}
          >
            {promotions.map((promotion) => (
              <Link key={promotion._id} to={`/shop/promotion/${promotion._id}`}>
                <div>
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={promotion.image || placeholderImage}
                    alt={promotion.description}
                  />
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        {/* Small Banner 1 */}
        <div className="relative">
          <img
            className="h-full w-full object-cover rounded-lg"
            src="https://cand.com.vn/Files/Image/honghai/2019/09/19/c6e7c185-dfc6-42df-a5b6-40249d310a3f.jpg"
            alt="Sách mới ra mắt"
          />
          <div className="absolute bottom-4 left-4 sm:left-8">
            <Link
              to='/new-releases'
              className="bg-accentDark hover:bg-accent text-white rounded-full w-fit flex items-center gap-4 px-4 py-2 text-[14px] sm:px-6 sm:py-3 cursor-pointer"
            >
              Xem sách vừa mới ra mắt <BsArrowRight/>
            </Link>
          </div>
        </div>

        {/* Small Banner 2 */}
        <div className="relative">
          <img
            className="h-full w-full object-cover rounded-lg"
            src="https://bookish.vn/wp-content/uploads/2019/09/sach-moi-truong.jpg"
            alt="Tất cả sách tại nhà sách"
          />
          <div className="absolute bottom-4 left-4 sm:left-8">
            <Link
              to='/all-shop'
              className="bg-accentDark hover:bg-accent text-white rounded-full w-fit flex items-center gap-4 px-4 py-2 text-[14px] sm:px-6 sm:py-3 cursor-pointer"
            >
              Xem tất cả sách tại nhà sách <BsArrowRight/>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;
