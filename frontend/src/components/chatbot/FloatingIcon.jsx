import React, { useState } from 'react';
import Support from '../../assets/support.jpg'; 
import ZaloChat from '../../assets/zalochat.jpg'; 
import MapIcon from '../../assets/map.jpg'; 
import Phone from '../../assets/phone.jpg';

const FloatingIcon = () => {
  const [showIcons, setShowIcons] = useState(false);

  const toggleIcons = () => setShowIcons(!showIcons);
  const openZaloChat = () => {
    window.open('https://zalo.me/84343899504', '_blank');
  };
  const callPhoneNumber = () => {
    window.open('tel:+84343899504');
  };
  const openMap = () => {
    window.open('https://maps.app.goo.gl/1A9LinjZs8AThnBKA', '_blank');
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <div className="relative cursor-pointer" onClick={toggleIcons}>
        <img src={Support} alt="Support" className="w-12 h-12" />
        {showIcons && (
          <div className="absolute bottom-14 right-0 flex flex-col items-center gap-2 bg-white p-2 rounded-lg shadow-md w-28">
            <div className="flex items-center gap-2 cursor-pointer" onClick={openZaloChat}>
              <img src={ZaloChat} alt="Zalo" className="w-8 h-8" />
              <div>Zalo</div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={openMap}>
              <img src={MapIcon} alt="Map" className="w-8 h-8" />
              <div>Map</div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={callPhoneNumber}>
              <img src={Phone} alt="Phone" className="w-8 h-8" />
              <div>Phone</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingIcon;
