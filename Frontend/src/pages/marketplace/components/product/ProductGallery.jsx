import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import PropTypes from "prop-types";
export const ProductGallery = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />

          {product.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 h-8 w-8"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 h-8 w-8"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next image</span>
              </Button>
            </>
          )}
        </div>
      </Card>

      {product.images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {product.images.map((image, index) => (
            <button
              key={`image-nav-${index}-${image.substring(0, 10)}`} // Combine index with partial URL
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => goToImage(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === currentImageIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ProductGallery.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
