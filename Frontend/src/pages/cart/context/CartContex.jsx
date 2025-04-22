// context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "1234567890abcdef12345678";

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCartItems(response.data.items || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = useCallback(async (cropId) => {
    try {
      // Find if item already exists in cart to determine quantity
      const existingItem = cartItems.find(item => item.cropId._id === cropId);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      
      await axios.post('http://localhost:3000/api/cart', {
        userId,
        cropId,
        quantity: newQuantity,
      });
      await fetchCart();
    } catch (err) {
      console.error('Failed to add to cart:', err.message);
    }
  }, [fetchCart, userId, cartItems]);

  const removeFromCart = useCallback(async (cropId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${userId}/item/${cropId}`);
      setCartItems(prev => prev.filter(item => item.cropId._id !== cropId));
    } catch (err) {
      console.error('Failed to remove from cart:', err.message);
    }
  }, [userId]);

  const updateQuantity = useCallback(async (cropId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.post('http://localhost:3000/api/cart', {
        userId,
        cropId,
        quantity: newQuantity, // Sending the exact new quantity
      });
      
      // Optimistically update the UI without waiting for fetchCart
      setCartItems(prev => 
        prev.map(item => 
          item.cropId._id === cropId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update quantity:', err.message);
      // If the API call fails, refresh the cart to get the accurate state
      fetchCart();
    }
  }, [fetchCart, userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};