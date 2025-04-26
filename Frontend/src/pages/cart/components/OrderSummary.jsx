"use client";

import React from "react";
import {
  CreditCard,
  Truck
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import PropTypes from "prop-types";

const OrderSummary = ({ cartItems, subtotal, shipping, tax, total, handleCheckout }) => (
    <Card className="sticky top-20">
      <CardHeader className="border-b">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId?._id}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">
                  {item.productId?.name || "Unknown Product"}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${(item.productId?.price || 0).toFixed(2)} x {item.quantity || 0}
                </p>
              </div>
            </div>
          ))}
          <Separator className="my-3" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span
                className={shipping === 0 ? "text-green-600 font-medium" : ""}
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
              <span>Add ${(35 - subtotal).toFixed(2)} more for free shipping</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col gap-3">
        <Button
          className="w-full bg-black text-white hover:bg-black/90"
          onClick={handleCheckout}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Proceed to Checkout
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
  );


OrderSummary.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
      }),
      quantity: PropTypes.number,
    })
  ).isRequired,
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  handleCheckout: PropTypes.func.isRequired,
};
export default OrderSummary;