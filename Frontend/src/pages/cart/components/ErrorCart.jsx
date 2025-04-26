// Component for error state
import React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";

const ErrorCart = ({ error, fetchCart, navigate }) => (
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
          <Button onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </Card>
  </div>
);

ErrorCart.propTypes = {
  error: PropTypes.string.isRequired,
  fetchCart: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ErrorCart;

