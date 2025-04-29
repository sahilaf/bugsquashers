"use client";

import React from "react";
import {
  ShoppingBag,
  ArrowLeft
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card
} from "../../../components/ui/card";
import PropTypes from "prop-types";
const EmptyCart = ({ navigate }) => (
    <div className="container mx-auto px-4 py-8 pt-20 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-blue-50 p-3 rounded-full mb-4">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button onClick={() => navigate("/market")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );


EmptyCart.propTypes = {
  navigate: PropTypes.func.isRequired,
};
export default EmptyCart;