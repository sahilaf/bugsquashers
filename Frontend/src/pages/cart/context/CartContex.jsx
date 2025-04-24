// context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

// Demo product data matching your Product schema
const DEMO_PRODUCTS = {
  'prod_organicTomato': {
    _id: 'prod_organicTomato',
    name: 'Organic Tomato',
    price: 4.99,
    originalPrice: 6.99,
    images: ['https://via.placeholder.com/200x200.png?text=Tomato'],
    isOrganic: true,
    category: 'Vegetables',
    keyFeatures: ['Heirloom variety', 'Vine-ripened', 'Chemical-free']
  },
  'prod_freshSpinach': {
    _id: 'prod_freshSpinach',
    name: 'Fresh Spinach',
    price: 3.49,
    images: ['https://via.placeholder.com/200x200.png?text=Spinach'],
    category: 'Leafy Greens',
    keyFeatures: ['Baby leaves', 'Triple-washed', 'Ready-to-eat']
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false); // Demo doesn't need loading
  const [error, setError] = useState(null);

  // Simplified demo mode implementation
  const fetchCart = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set initial demo cart
      setCartItems([
        { productId: DEMO_PRODUCTS.prod_organicTomato, quantity: 2 },
        { productId: DEMO_PRODUCTS.prod_freshSpinach, quantity: 1 }
      ]);
    } catch (err) {
      setError('Failed to load demo cart');
    }
  }, []);

  const addToCart = useCallback(async (productId) => {
    try {
      const product = DEMO_PRODUCTS[productId];
      if (!product) throw new Error('Invalid product');
      
      setCartItems(prev => {
        const exists = prev.find(item => item.productId._id === productId);
        if (exists) {
          return prev.map(item => 
            item.productId._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { productId: product, quantity: 1 }];
      });
    } catch (err) {
      console.error('Add to cart failed:', err.message);
      setError('Failed to add item');
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    setCartItems(prev => 
      prev.filter(item => item.productId._id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.productId._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
        cartTotal: cartItems.reduce((total, item) => 
          total + (item.productId.price * item.quantity), 0)
      }}
    >
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