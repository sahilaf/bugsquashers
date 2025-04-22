"use client";

import React, { useEffect } from "react";
import { 
  Trash2, ShoppingBag, CreditCard, ArrowLeft, Plus, 
  Minus, Truck, Clock, Tag, Leaf, Box, RefreshCw 
} from "lucide-react";
import { useCart } from './context/CartContex';

// Import shadcn components
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Toaster } from "../../components/ui/toaster";

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    fetchCart
  } = useCart();
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cartItems.reduce((total, item) => total + item.cropId.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Function to handle quantity decrease
  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  // Function to handle quantity increase
  const handleIncrease = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="flex gap-4 mb-6">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton key={index} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Cart</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => fetchCart()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={() => window.history.back()}>Continue Shopping</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Badge variant="secondary" className="ml-2">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle>Items</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={async () => {
                    try {
                      await Promise.all(
                        cartItems.map(item => removeFromCart(item.cropId._id))
                      );
                      Toaster({
                        title: "Cart Cleared",
                        description: "All items have been removed from your cart",
                      });
                    } catch (err) {
                      console.error("Failed to clear cart:", err.message);
                      Toaster({
                        title: "Error",
                        description: "Failed to clear cart. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {cartItems.map((item, index) => (
                <React.Fragment key={item.cropId._id}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={item.cropId.image || "https://placehold.co/200x200?text=Product"}
                          alt={item.cropId.name}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                        {item.cropId.isOrganic && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2">
                            <Leaf className="h-3 w-3 mr-1" />
                            Organic
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.cropId.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.cropId.category || "Uncategorized"}
                            </Badge>
                            {item.cropId.supplier && (
                              <Badge variant="outline" className="text-xs">
                                Supplier: {item.cropId.supplier}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Additional info with icons */}
                          <div className="mt-2 flex flex-col text-xs text-muted-foreground">
                            {item.cropId.harvestDate && item.cropId.harvestDate !== "N/A" && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Harvested: {item.cropId.harvestDate}</span>
                              </div>
                            )}
                            {item.cropId.expirationDate && item.cropId.expirationDate !== "N/A" && (
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>Best before: {item.cropId.expirationDate}</span>
                              </div>
                            )}
                            {item.cropId.stock && (
                              <div className="flex items-center gap-1">
                                <Box className="h-3 w-3" />
                                <span>In stock: {item.cropId.stock}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="font-medium text-lg">${(item.cropId.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.cropId.price.toFixed(2)} each</p>
                          
                          {/* Original price if exists and discounted */}
                          {item.cropId.originalPrice && item.cropId.originalPrice > item.cropId.price && (
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-xs line-through text-muted-foreground mr-2">
                                ${item.cropId.originalPrice.toFixed(2)}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {Math.round(((item.cropId.originalPrice - item.cropId.price) / item.cropId.originalPrice) * 100)}% OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleDecrease(item.cropId._id, item.quantity)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleIncrease(item.cropId._id, item.quantity)}
                            disabled={item.cropId.stock && item.quantity >= item.cropId.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                          onClick={() => {
                            removeFromCart(item.cropId._id);
                            Toaster({
                              title: "Item Removed",
                              description: `${item.cropId.name} has been removed from your cart`,
                            });
                          }}
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
            <CardFooter className="bg-muted/50 p-6 flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <div className="text-sm text-muted-foreground">
                {shipping === 0 ? (
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4 text-green-500" />
                    <span>Free shipping applied</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    <span>Free shipping on orders over $35</span>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader className="border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {shipping > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-md text-xs text-blue-700 flex items-center">
                  <Truck className="h-3 w-3 mr-1" />
                  <span>Add ${(35 - subtotal).toFixed(2)} more for free shipping</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col gap-3">
              <Button className="w-full bg-black text-white hover:bg-black/90">
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>We accept:</span>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs">Visa</div>
                  <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs">MC</div>
                  <div className="w-10 h-5 bg-muted rounded flex items-center justify-center text-xs">Amex</div>
                  <div className="w-10 h-5 bg-muted rounded flex items-center justify-center text-xs">PayP</div>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Need Help */}
          <Card className="mt-4 bg-muted/30">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium mb-2">Need Help?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Our customer service team is available 24/7 to assist you with any questions.
              </p>
              <Button variant="link" className="text-xs p-0 h-auto">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;