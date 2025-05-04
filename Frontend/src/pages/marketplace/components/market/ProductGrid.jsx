import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import PropTypes from "prop-types";
import { useCart } from "../../../cart/context/CartContex";

function ProductGrid({ shops, currentPage, totalPages, onPageChange }) {
  const currentShops = shops;
  const { addToCart } = useCart();
  
  return (
    <div className="space-y-6">
      {/* Results and Sort Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {shops.length} shops
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap hidden xs:inline">
            Sort by:
          </span>
          <Select defaultValue="best-match">
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Best Match" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-match">Best Match</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shops */}
      {currentShops.length > 0 ? (
        currentShops.map((shop) => (
          <div key={shop._id} className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">{shop.name}</h2>
            </div>

            {shop.products && shop.products.length > 0 ? (
              <ScrollArea className="w-full">
                <div className="flex w-max space-x-4 pb-4">
                  {shop.products.map((product) => (
                    <div
                      key={product._id}
                      className="w-[200px] sm:w-[220px] shrink-0 flex flex-col rounded-lg border dark:border-none bg-card overflow-hidden transition-shadow hover:shadow-md"
                    >
                      <Link
                        to={`/product/${product._id}`}
                        className="block h-full"
                      >
                        <div className="relative h-64 sm:h-80">
                          <img
                            src={
                              product?.images?.[0] ||
                              product?.image ||
                              "https://via.placeholder.com/200x150?text=Product+Image"
                            }
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#1b1b1b50] backdrop-blur-sm border-t border-t-[#ffffff33]">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-white drop-shadow">
                                ${product.price.toFixed(2)}
                                {product.originalPrice > 0 && (
                                  <span className="ml-1 text-xs line-through text-white">
                                    ${product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </p>
                              {product.isOrganic && (
                                <Badge className="bg-green-500/90 text-white text-[10px]">
                                  Organic
                                </Badge>
                              )}
                            </div>
                            <div className="p-2 space-y-2 flex-1 flex flex-col">
                              <div className="space-y-1">
                                <h3 className="line-clamp-2 text-sm font-bold text-white">
                                  {product.name}
                                </h3>
                              </div>
                              <div className="flex items-center justify-between pt-2 mt-auto">
                                <span className="text-xs text-white">
                                  Sold {product.soldCount || 0}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-10 w-10 rounded-full text-white"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product._id); // Send product ID instead of entire product
                                  }}
                                >
                                  <ShoppingCart className="h-5 w-5" />
                                  <span className="sr-only">Add to cart</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No products available for this shop
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center py-8">
          No shops found matching your criteria
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

ProductGrid.propTypes = {
  shops: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      products: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string,
          price: PropTypes.number.isRequired,
          originalPrice: PropTypes.number,
          image: PropTypes.string,
          isOrganic: PropTypes.bool,
          soldCount: PropTypes.number,
          category: PropTypes.string,
          shop: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            // Add other shop properties as needed
          }),
          createdAt: PropTypes.string,
        })
      ),
      // Add other shop properties as needed
    })
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default ProductGrid;
