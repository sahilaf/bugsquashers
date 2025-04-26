"use client";

import React from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

const OrderConfirmation = () => {
  const location = useLocation(); // Get location to access state
  const navigate = useNavigate(); // For navigation
  const { orderId, total, fullName } = location.state || {}; // Destructure state, default to empty object

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Order Confirmation</h1>
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-green-50 p-3 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {fullName ? `Thank You, ${fullName}!` : "Thank You!"}
          </h2>
          <p className="text-muted-foreground mb-4">
            Your order has been successfully placed.
            {orderId && total ? (
              <>
                {" "}
                Order <span className="font-medium">#{orderId}</span> for{" "}
                <span className="font-medium">${total}</span> will be processed soon.
              </>
            ) : (
              " You'll receive a confirmation email soon."
            )}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Check your email for order details and updates.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderConfirmation;