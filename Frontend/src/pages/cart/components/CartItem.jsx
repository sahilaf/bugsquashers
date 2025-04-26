"use client";

import React from "react";
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  Leaf,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import PropTypes from "prop-types";

const CartItem = ({ item, index, cartLength, updateQuantity, removeFromCart }) => {
    if (!item.productId) {
      console.warn(`Cart item at index ${index} has no productId:`, item);
      return null;
    }
  
    return (
      <React.Fragment key={item.productId._id}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={
                  item.productId.images?.[0] ||
                  "https://placehold.co/200x200?text=Product"
                }
                alt={item.productId.name || "Product"}
                className="w-24 h-24 object-cover rounded-md border"
              />
              {item.productId.isOrganic && (
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs flex items-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </span>
              )}
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <h3 className="font-medium text-lg">
                  {item.productId.name || "Unknown Product"}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs border border-border rounded px-2 py-1">
                    {item.productId.category || "N/A"}
                  </span>
                  <span className="text-xs border border-border rounded px-2 py-1">
                    SKU: {item.productId.sku || "N/A"}
                  </span>
                </div>
                <div className="mt-2 flex flex-col text-xs text-muted-foreground">
                  {(item.productId.keyFeatures || []).map((feature) => (
                    <div key={feature} className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="font-medium text-lg">
                  ${((item.productId.price || 0) * (item.quantity || 0)).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${(item.productId.price || 0).toFixed(2)} each
                </p>
                {item.productId.originalPrice > (item.productId.price || 0) && (
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-xs line-through text-muted-foreground mr-2">
                      ${(item.productId.originalPrice || 0).toFixed(2)}
                    </span>
                    <span className="text-xs bg-destructive text-destructive-foreground rounded px-2 py-1">
                      {item.productId.discountPercentage || 0}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center mt-5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  console.log(
                    "Decreasing quantity for productId:",
                    item.productId._id,
                    "Current quantity:",
                    item.quantity
                  );
                  updateQuantity(item.productId._id, (item.quantity || 0) - 1);
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="mx-3 w-8 text-center font-medium">
                {item.quantity || 0}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  console.log(
                    "Increasing quantity for productId:",
                    item.productId._id,
                    "Current quantity:",
                    item.quantity
                  );
                  updateQuantity(item.productId._id, (item.quantity || 0) + 1);
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm">Quantity: {item.quantity || 0}</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                onClick={() => {
                  removeFromCart(item.productId._id);
                  toast.info("Item Removed", {
                    description: `${item.productId.name || "Product"} removed from cart`,
                  });
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
        {index < cartLength - 1 && <Separator className="my-6" />}
      </React.Fragment>
    );
  };


CartItem.displayName = "CartItem";
CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string),
      isOrganic: PropTypes.bool,
      category: PropTypes.string,
      sku: PropTypes.string,
      keyFeatures: PropTypes.arrayOf(PropTypes.string),
      price: PropTypes.number,
      originalPrice: PropTypes.number,
      discountPercentage: PropTypes.number,
    }).isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  cartLength: PropTypes.number.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};
export default CartItem;