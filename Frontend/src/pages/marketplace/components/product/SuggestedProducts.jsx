import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ProductCard } from "./ProductCard";
import PropTypes from "prop-types";
export const SuggestedProducts = ({ products }) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-primary"
            onClick={() => alert("Previous products")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-primary"
            onClick={() => alert("Next products")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

SuggestedProducts.propTypes = {
  products: PropTypes.array.isRequired,
};