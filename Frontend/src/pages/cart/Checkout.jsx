"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Truck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCart } from "./context/CartContex";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const Checkout = () => {
  const { cartItems, cartTotal, confirmPayment } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const shipping = cartTotal > 35 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { fullName, address, city, state, zip, country } = shippingInfo;
    const { cardNumber, expiry, cvv } = paymentInfo;

    if (!fullName || !address || !city || !state || !zip || !country) {
      toast.error("Please fill in all shipping fields");
      return false;
    }

    if (!cardNumber || cardNumber.length < 12) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!cvv || cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    toast.success("Order confirmed"); // Show immediate confirmation for demo

    try {
      console.log("Cart items before confirmPayment:", cartItems); // Debug log
      const response = await confirmPayment();
      console.log("confirmPayment response:", response); // Debug log
      if (response?.success) {
        setTimeout(() => {
          navigate("/order-confirmation", {
            state: {
              orderId: response.orderId,
              total: total.toFixed(2),
              fullName: shippingInfo.fullName,
            },
          });
          setIsProcessing(false); // Reset processing state after navigation
        }, 1000); // Short delay for smooth UX
      } else {
        throw new Error(response?.message || "Payment failed: Invalid response");
      }
    } catch (error) {
      console.error("Payment error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.message === "User not authenticated") {
        console.error("Please log in to checkout");
        setTimeout(() => navigate("/login"), 1500);
      } else if (error.message === "Cart is empty") {
        console.error("Your cart is empty. Add items to proceed.");
        setTimeout(() => navigate("/cart"), 1500);
      } else {
        console.error(`Order processing failed: ${error.message || "Please try again."}`);
      }
      setIsProcessing(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">
              Your cart is empty. Add items to proceed with checkout.
            </p>
            <Button onClick={() => navigate("/market")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={shippingInfo.zip}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={(e) => handleInputChange(e, "shipping")}
                    placeholder="United States"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handleInputChange(e, "payment")}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    value={paymentInfo.expiry}
                    onChange={(e) => handleInputChange(e, "payment")}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleInputChange(e, "payment")}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader className="border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.productId?._id || `summary-item-${index}`}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.productId?.name || "Unknown Product"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${(item.productId?.price || 0).toFixed(2)} x{" "}
                        {item.quantity || 0}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${((item.productId?.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator className="my-3" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
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
                    <span>
                      Add ${(35 - cartTotal).toFixed(2)} more for free shipping
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex flex-col gap-3">
              <Button
                className="w-full bg-black text-white hover:bg-black/90"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>We accept:</span>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs">
                    Visa
                  </div>
                  <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs">
                    MC
                  </div>
                  <div className="w-10 h-5 bg-muted rounded flex items-center justify-center text-xs">
                    Amex
                  </div>
                  <div className="w-10 h-5 bg-muted rounded flex items-center justify-center text-xs">
                    PayP
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;