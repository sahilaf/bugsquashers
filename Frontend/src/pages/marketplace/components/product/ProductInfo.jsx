import { useState } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import PropTypes from "prop-types";
export const ProductInfo = ({ onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("red");

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const handleVariantChange = (value) => {
    setSelectedVariant(value);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    onBuyNow(quantity, selectedVariant);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organic Apples</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex">
            {["star1", "star2", "star3", "star4", "star5"].map((star, i) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  i < 4
                    ? "fill-primary text-primary"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            (4.5 stars) • 20 reviews
          </span>
        </div>
        <div className="text-2xl font-bold mt-2">$3</div>
      </div>

      <p className="text-muted-foreground">
        Enjoy the crisp, refreshing taste of our organic apples, sourced from
        local farms. Perfect for snacking or adding to your favorite recipes.
      </p>

      <ul className="space-y-1 list-disc pl-5">
        <li>Fresh and delicious choice</li>
        <li>Packed with nutrients</li>
        <li>Perfect for healthy snacks</li>
      </ul>

      <div className="space-y-4">
        <div>
          <label htmlFor="variant" className="text-sm font-medium mb-1 block">
            Variant:
          </label>
          <Tabs
            defaultValue={selectedVariant}
            className="w-full"
            onValueChange={handleVariantChange}
          >
            <TabsList className="grid grid-cols-3 h-auto">
              <TabsTrigger id="variant-red" value="red" className="py-2">
                Red Apples
              </TabsTrigger>
              <TabsTrigger id="variant-green" value="green" className="py-2">
                Green Apples
              </TabsTrigger>
              <TabsTrigger id="variant-yellow" value="yellow" className="py-2">
                Yellow Apples
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

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
          <p className="text-xs text-center text-muted-foreground">
            Free shipping over $10
          </p>
        </div>
      </div>
    </div>
  );
};

ProductInfo.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  onBuyNow: PropTypes.func.isRequired,
};