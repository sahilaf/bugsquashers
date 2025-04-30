import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userId: uid } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch cart using Firebase UID
  const fetchCart = useCallback(async () => {
    if (!uid) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/cart/${uid}`);
      setCartItems(res.data.items || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      const message =
        err.response?.status === 404 ? "Cart not found" : "Could not load cart";
      setError(message);
      setCartItems([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  // Add item to cart
  const addToCart = useCallback(
    async (productId) => {
      if (!uid) {
        setError("User not authenticated");
        toast.error("Please log in to add items to cart");
        return;
      }
      if (!productId) {
        setError("Invalid product ID");
        toast.error("Invalid product");
        return;
      }

      try {
        console.log("Adding to cart:", { uid, productId });
        const res = await axios.post(`${BASE_URL}/api/cart`, {
          uid,
          productId: productId.toString(),
          quantity: 1,
        });
        if (!res.data || !Array.isArray(res.data.items)) {
          throw new Error("Invalid response from server");
        }
        setCartItems(res.data.items || []);
        setError(null);
        toast.success("Item added to cart");
        await fetchCart();
      } catch (err) {
        console.error("Add to cart failed:", err);
        const message =
          err.response?.data?.message || "Failed to add item to cart";
        setError(message);
        toast.error(message);
      }
    },
    [uid, fetchCart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (productId) => {
      if (!uid) {
        setError("User not authenticated");
        toast.error("Please log in to remove items");
        return;
      }

      try {
        const res = await axios.delete(
          `${BASE_URL}/api/cart/${uid}/item/${productId}`
        );
        setCartItems(res.data.cart.items || []);
        setError(null);
        await fetchCart();
      } catch (err) {
        console.error("Remove from cart failed:", err);
        const message =
          err.response?.data?.message || "Failed to remove item from cart";
        setError(message);
        toast.error(message);
      }
    },
    [uid, fetchCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (productId, newQuantity) => {
      // Validation checks
      if (!uid) return handleAuthError("Please log in to update cart");
      if (!productId) return handleInvalidProduct();
      if (!isValidQuantity(newQuantity)) return handleInvalidQuantity();

      try {
        const res = await sendUpdateRequest(uid, productId, newQuantity);
        handleUpdateResponse(res, newQuantity);
      } catch (err) {
        handleUpdateError(err, productId);
      }
    },
    [uid, fetchCart, addToCart]
  );

  // Helper functions defined inside the component
  const handleAuthError = (message) => {
    setError("User not authenticated");
    toast.error(message);
  };

  const handleInvalidProduct = () => {
    setError("Invalid product ID");
    toast.error("Invalid product");
  };

  const isValidQuantity = (qty) => Number.isInteger(qty) && qty > 0;

  const handleInvalidQuantity = () => {
    setError("Quantity must be a positive integer");
    toast.error("Quantity must be at least 1");
  };

  const sendUpdateRequest = async (uid, productId, quantity) => {
    return axios.put(
      `${BASE_URL}/api/cart/${uid}/item/${productId}`,
      {
        quantity,
      }
    );
  };

  const handleUpdateResponse = (res, newQuantity) => {
    if (res.data?.cart?.items) {
      setCartItems(res.data.cart.items);
      setError(null);
      toast.success(`Quantity updated to ${newQuantity}`);
    } else {
      throw new Error("Invalid response structure");
    }
  };

  const handleUpdateError = async (err, productId) => {
    const errorInfo = analyzeError(err);

    if (errorInfo.isHtmlResponse) {
      console.error("Received HTML response:", err.response.data);
    }

    if (errorInfo.needsRetry) {
      await handleRetryScenario(productId, errorInfo.message);
      return;
    }

    if (errorInfo.is404) {
      const handled = await handle404Cases(err, productId);
      if (handled) return;
    }

    showFinalError(errorInfo.message);
    await fetchCart();
  };

  const analyzeError = (err) => ({
    isHtmlResponse:
      typeof err.response?.data === "string" &&
      err.response.data.includes("<!DOCTYPE html>"),
    needsRetry:
      err.response?.status === 404 &&
      err.response.data?.message === "Item not found in cart",
    is404: err.response?.status === 404,
    message: err.response?.data?.message || "Failed to update quantity",
  });

  const handleRetryScenario = async (productId, message) => {
    try {
      await addToCart(productId);
      toast.info("Item was missing. Added to cart.");
    } catch (addErr) {
      // Properly handle the error instead of just rethrowing
      console.error("Retry add to cart failed:", addErr);
      toast.error(`${message}: Retry failed`);
      throw addErr; // Only rethrow if higher-level handling is needed
    }
  };

  const handle404Cases = async (err, productId) => {
    if (err.response.data?.message === "Cart not found") {
      return handleMissingCart(productId);
    }
    return false;
  };

  const handleMissingCart = async (productId) => {
    try {
      await axios.get(`${BASE_URL}/api/cart/${uid}`);
      await addToCart(productId);
      toast.info("Cart created. Item added to cart.");
      return true;
    } catch (createErr) {
      console.error("Cart creation failed:", createErr);
      return false;
    }
  };

  const showFinalError = (message) => {
    setError(message);
    toast.error(message);
  };

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!uid) {
      setError("User not authenticated");
      toast.error("Please log in to clear cart");
      return;
    }

    try {
      const res = await axios.delete(`${BASE_URL}/api/cart/${uid}`);
      setCartItems(res.data.cart.items || []);
      setError(null);
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Clear cart failed:", err);
      const message = err.response?.data?.message || "Failed to clear cart";
      setError(message);
      toast.error(message);
    }
  }, [uid]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch cart when UID changes
  useEffect(() => {
    fetchCart();
  }, [uid, fetchCart]);

  // Calculate cart totals with robust null checks
  const cartCount =
    cartItems?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;

  const cartTotal =
    cartItems?.reduce(
      (total, item) =>
        total + (item?.productId?.price || 0) * (item?.quantity || 0),
      0
    ) || 0;

  const contextValue = useMemo(
    () => ({
      cartItems,
      loading,
      error,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [
      cartItems,
      loading,
      error,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    ]
  );
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
