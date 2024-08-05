import React, { useEffect } from 'react';

const Chatbot = ({ onClose }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'chatway';
    script.async = true;
    script.src = 'https://cdn.chatway.app/widget.js?id=l0tyzcK5abcZ';
    document.body.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('chatway');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '80px', right: '0px', zIndex: 1000 }}>
    
    </div>
  );
};

export default Chatbot;
