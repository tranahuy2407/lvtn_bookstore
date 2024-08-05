import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ShopByPromotion = () => {
  const [promotion, setPromotion] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/programs/${id}`);
        setPromotion(response.data);
      } catch (error) {
        console.error('Error fetching promotion:', error);
        setError('Error fetching promotion data.');
      }
    };
    fetchPromotion();
  }, []);

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
          <div className="text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">
              {promotion.name || 'Default Name'}
            </h2>
            <p className="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-lg md:leading-relaxed">
              {promotion.description || 'Default description'}
            </p>
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
      </div>
    </>
  );
};

export default ShopByPromotion;
