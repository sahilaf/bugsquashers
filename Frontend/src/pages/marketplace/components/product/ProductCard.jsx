import PropTypes from "prop-types";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";

export const ProductCard = ({ product }) => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        className={`h-3 w-3 ${
          i < rating
            ? "fill-primary text-primary"
            : "fill-muted stroke-muted-foreground"
        }`}
      />
    ));

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {product.badge && (
          <Badge
            className={`absolute top-2 left-2 ${
              product.badge === "Sale" ? "bg-red-500" : "bg-primary"
            }`}
          >
            {product.badge}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="font-bold">
            {product.salePrice ? (
              <>
                <span className="text-red-500">${product.salePrice}</span>
                <span className="text-muted-foreground text-xs line-through ml-1">
                  ${product.price}
                </span>
              </>
            ) : (
              <>${product.price}</>
            )}
          </div>
          <div className="flex">{renderStars(product.rating)}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-primary"
          onClick={() => alert(`Added ${product.name} to cart`)}
        >
          <ShoppingCart className="h-3 w-3 mr-1" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    badge: PropTypes.string,
    salePrice: PropTypes.string,
    price: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};