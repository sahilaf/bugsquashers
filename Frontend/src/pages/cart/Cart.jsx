"use client";

import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag, CreditCard, ArrowLeft, Plus, Minus } from "lucide-react";
import axios from "axios";

// Import shadcn components
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "1234567890abcdef12345678"; // Hardcoded for demo

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
        setCartItems(response.data.items || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch cart");
        setLoading(false);
        console.error("Failed to fetch cart:", err.message);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (cropId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await axios.post("http://localhost:3000/api/cart", {
        userId,
        cropId,
        quantity: newQuantity,
      });
      setCartItems(response.data.items);
    } catch (err) {
      console.error("Failed to update quantity:", err.message);
    }
  };

  const removeItem = async (cropId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${userId}/item/${cropId}`);
      setCartItems(cartItems.filter((item) => item.cropId._id !== cropId));
    } catch (err) {
      console.error("Failed to remove item from cart:", err.message);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.cropId.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.history.back()}>Continue Shopping</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => window.history.back()}>Continue Shopping</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Badge className="ml-2">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {cartItems.map((item, index) => (
                <React.Fragment key={item.cropId._id}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.cropId.image || "https://placehold.co/100x100?text=Product"}
                        alt={item.cropId.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="font-medium">{item.cropId.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.cropId.unit || "Unit"}</p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="font-medium">${(item.cropId.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.cropId.price.toFixed(2)} each</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.cropId._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.cropId._id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => removeItem(item.cropId._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < cartItems.length - 1 && <Separator className="my-6" />}
                </React.Fragment>
              ))}
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 flex justify-between">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await Promise.all(
                      cartItems.map((item) =>
                        axios.delete(`http://localhost:3000/api/cart/${userId}/item/${item.cropId._id}`)
                      )
                    );
                    setCartItems([]);
                  } catch (err) {
                    console.error("Failed to clear cart:", err.message);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground mt-3">Free shipping on orders over $35</p>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col gap-3">
              <Button className="w-full bg-black text-white hover:bg-black/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>We accept:</span>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                  <div className="w-8 h-5 bg-muted rounded"></div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Promo Code */}
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium mb-3">Promo Code</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter code" className="flex-grow" />
                <Button variant="outline">Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Estimate */}
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium mb-3">Shipping Estimate</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter ZIP code" className="flex-grow" />
                <Button variant="outline">Calculate</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
