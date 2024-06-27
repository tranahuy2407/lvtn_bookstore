import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    return storedCartItems || [];
  });

  const [discountCode, setDiscountCode] = useState(() => {
    const storedDiscountCode = JSON.parse(localStorage.getItem("discountCode"));
    return storedDiscountCode || "";
  });

  const [discountApplied, setDiscountApplied] = useState(() => {
    const storedDiscountApplied = JSON.parse(localStorage.getItem("discountApplied"));
    return storedDiscountApplied || false;
  });

  const [discountedPrice, setDiscountedPrice] = useState(() => {
    const storedDiscountedPrice = JSON.parse(localStorage.getItem("discountedPrice"));
    return storedDiscountedPrice || 0;
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.promotion_price * item.cartQuantity,
    0
  );
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("discountCode", JSON.stringify(discountCode));
  }, [discountCode]);

  useEffect(() => {
    localStorage.setItem("discountApplied", JSON.stringify(discountApplied));
  }, [discountApplied]);

  useEffect(() => {
    localStorage.setItem("discountedPrice", JSON.stringify(discountedPrice));
  }, [discountedPrice]);

  useEffect(() => {
    if (discountApplied && discountCode) {
      const promotionValue = discountCode.value || 0; 
      const discountType = discountCode.type || 'amount'; 
      
      let discountAmount = 0;
      if (discountType === 'percent') {
        discountAmount = (totalPrice * promotionValue) / 100;
      } else {
        discountAmount = promotionValue;
      }

      setDiscountedPrice(totalPrice - discountAmount);
    } else {
      setDiscountedPrice(totalPrice);
    }
  }, [cartItems, totalPrice, discountApplied, discountCode]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.name === item.name
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          cartQuantity: updatedItems[existingItemIndex].cartQuantity + 1,
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          {
            ...item,
            cartQuantity: 1,
            cartId: Date.now(),
            discountedPrice: item.promotion_price,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId)
    );
  };

  const increaseQuantity = (cartId) => {
  setCartItems((prevItems) => {
    return prevItems.map((item) =>
      item.cartId === cartId
        ? { ...item, cartQuantity: item.cartQuantity + 1 }
        : item
    );
  });
};

const decreaseQuantity = (cartId) => {
  setCartItems((prevItems) => {
    return prevItems.map((item) =>
      item.cartId === cartId && item.cartQuantity > 1
        ? { ...item, cartQuantity: item.cartQuantity - 1 }
        : item
    );
  });
};

const updateQuantity = (cartId, newQuantity) => {
  setCartItems((prevItems) => {
    return prevItems.map((item) =>
      item.cartId === cartId
        ? { ...item, cartQuantity: newQuantity }
        : item
    );
  });
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
         updateQuantity,
        discountCode,
        totalPrice,
        setDiscountCode,
        discountApplied,
        setDiscountApplied,
        discountedPrice,
        setDiscountedPrice,
        discountApplied,
        setDiscountApplied,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
