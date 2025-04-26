import { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import PropTypes from "prop-types";
import { useCart } from "../../../cart/context/CartContex";
import { ProductTabs } from "./ProductTabs";
export const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, confirmPayment } = useCart();

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id);
      }
      const paymentSuccess = await confirmPayment();
      if (paymentSuccess) {
        window.location.href = "/order-confirmation";
      }
    } catch (err) {
      console.error("Buy now failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= 4
                    ? "fill-primary text-primary"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            (4.5 stars) • {product.soldCount || 0} sold
          </span>
        </div>
        <div className="text-2xl font-bold mt-2">
          ${product.price.toFixed(2)}
          {product.originalPrice > product.price && (
            <span className="ml-2 text-base text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <ul className="space-y-1 list-disc pl-5">
          {product.keyFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="quantity" className="text-sm font-medium mb-1 block">
            Quantity:
          </label>
          <Input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-primary text-white hover:bg-primary-hover"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
          <Button
            variant="outline"
            className="w-full bg-secondary hover:bg-secondary-hover"
            onClick={handleBuyNow}
          >
            Buy now
          </Button>
          {product.isOrganic && (
            <p className="text-xs text-center text-green-600">
              Certified Organic Product
            </p>
          )}
        </div>
        <ProductTabs />
      </div>
    </div>
  );
};

ProductInfo.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    keyFeatures: PropTypes.arrayOf(PropTypes.string),
    soldCount: PropTypes.number,
    isOrganic: PropTypes.bool,
  }).isRequired,
};