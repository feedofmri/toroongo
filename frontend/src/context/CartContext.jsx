import React, { createContext, useContext, useState, useEffect } from "react";
import { convertCurrency, getBuyerCurrencyCode } from "../utils/currency";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from local storage specifically for the device rather than user for now
  useEffect(() => {
    const storedCart = localStorage.getItem("toroongo_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("toroongo_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCart((prev) => {
      const variantKey = JSON.stringify(variant || {});
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.variant || {}) === variantKey,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id &&
          JSON.stringify(item.variant || {}) === variantKey
            ? { ...item, quantity: item.quantity + quantity, price: product.price }
            : item,
        );
      }
      return [...prev, { ...product, quantity, variant }];
    });
  };

  const removeFromCart = (productId, variant = null) => {
    const variantKey = JSON.stringify(variant || {});
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            JSON.stringify(item.variant || {}) === variantKey
          ),
      ),
    );
  };

  const updateQuantity = (productId, quantity, variant = null) => {
    if (quantity < 1) {
      removeFromCart(productId, variant);
      return;
    }
    const variantKey = JSON.stringify(variant || {});
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId &&
        JSON.stringify(item.variant || {}) === variantKey
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    const buyerCode = getBuyerCurrencyCode();
    return cart.reduce((total, item) => {
      const converted = convertCurrency(item.price, item.currency_code || 'USD', buyerCode);
      return total + (converted * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
