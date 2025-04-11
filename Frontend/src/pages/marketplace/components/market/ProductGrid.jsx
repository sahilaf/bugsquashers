import { useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

function ProductGrid() {
  const [shops] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Shop ${i + 1}`,
      products: Array.from({ length: 10 }, (_, j) => ({
        id: (i + 1) * 100 + j,
        name: `Product ${j + 1}`,
        price: Math.random() * 10 + 5,
        originalPrice: Math.random() * 10 + 10,
        description: "Sample product description",
        image: "https://placehold.co/300x300",
        isOrganic: Math.random() > 0.5,
        soldCount: Math.floor(Math.random() * 100)
      }))
    }))
  );


  const [currentPage, setCurrentPage] = useState(1);
  const shopsPerPage = 10;

  // Calculate pagination values
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = shops.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(shops.length / shopsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="space-y-6">
      {/* Results and Sort Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            1 - 16 over 7,000 results for{" "}
            <span className="text-primary font-medium">"Fruits"</span>
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
      {currentShops.map((shop) => (
        <div key={shop.id} className="rounded-lg border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">{shop.name}</h2>
            <Link
              to={`/shop/${shop.id}`}
              className="flex items-center text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 pb-4">
              {shop.products.map((product) => (
                <div
                  key={`${shop.id}-${product.id}`}
                  className="w-[200px] sm:w-[220px] shrink-0 flex flex-col rounded-lg border dark:border-none bg-card overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className="relative h-64 sm:h-80 ">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />

                    {/* Frosted Glass Overlay */}
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
                      <div className="p-2 space-y-2 flex-1 flex flex-col ">
                        <div className="space-y-1">
                          <h3 className="line-clamp-2 text-sm font-bold text-white">
                            {product.name}
                          </h3>
                          <p className="line-clamp-2 text-xs text-white">
                            {product.description}
                          </p>
                        </div>

                        {/* Sold Count + Cart */}
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <span className="text-xs text-white">
                            Sold {product.soldCount}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-10 w-10 rounded-full text-white"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Add to cart</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ))}
        
        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ProductGrid;
