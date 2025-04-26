"use client";

import React, { useEffect } from "react";
import {
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContex";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import  NeedHelp  from "./components/NeedHelp";
import  LoadingCart  from "./components/LoadingCart";
import  ErrorCart  from "./components/ErrorCart";
import  EmptyCart  from "./components/EmptyCart";
import  OrderSummary  from "./components/OrderSummary";
import  CartItem  from "./components/CartItem";

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    fetchCart,
    addToCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const clearCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item) => removeFromCart(item.productId?._id || ""))
      );
      toast.success("Cart Cleared", {
        description: "All items have been removed from your cart",
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Error Clearing Cart", {
        description: "Failed to clear cart. Please try again.",
      });
    }
  };

  if (loading) return <LoadingCart />;
  if (error && cartItems.length === 0)
    return <ErrorCart error={error} fetchCart={fetchCart} navigate={navigate} />;
  if (cartItems.length === 0) return <EmptyCart navigate={navigate} />;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      {error && (
        <Card className="mb-4 bg-red-50 border-red-200">
          <CardContent className="p-4 text-red-700">
            <p>{error}</p>
            {error.includes("Item not found") && (
              <Button
                variant="link"
                className="p-0 mt-2 text-red-700"
                onClick={() =>
                  addToCart(
                    cartItems.find((item) => item.productId?._id)?.productId
                      ?._id
                  )
                }
              >
                Try adding the item again
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.productId._id}
                  item={item}
                  index={index}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            handleCheckout={handleCheckout}
          />
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

export default Cart;