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
  const [shops] = useState([
    {
      id: 1,
      name: "Fresh Farms",
      products: [
        {
          id: 101,
          name: "Organic Apples (3 lb)",
          price: 4.99,
          originalPrice: 6.99,
          description: "Freshly Picked, Local Farm",
          image:
            "https://hips.hearstapps.com/hmg-prod/images/half-of-orange-on-the-heap-of-oranges-royalty-free-image-1598525395.jpg?resize=2048:*",
          isOrganic: true,
          soldCount: 120,
        },
        {
          id: 102,
          name: "Carrots (2 lb)",
          price: 2.49,
          originalPrice: 3.49,
          description: "Fresh from the garden",
          image:
            "https://www.butter-n-thyme.com/wp-content/uploads/2022/10/DIFFERENT-VARIATIONS-OF-CARROTS-1.jpg",
          isOrganic: false,
          soldCount: 85,
        },
        {
          id: 103,
          name: "Bananas (1 lb)",
          price: 0.99,
          originalPrice: 1.29,
          description: "Perfectly ripe",
          image: "https://www.refinery29.com/images/10329784.jpg?crop=40:21",
          isOrganic: false,
          soldCount: 200,
        },
        {
          id: 104,
          name: "Organic Kale",
          price: 2.99,
          originalPrice: 3.99,
          description: "Nutrient-packed greens",
          image:
            "https://cdn.britannica.com/74/181374-050-83F7B492/kale-leaves.jpg",
          isOrganic: true,
          soldCount: 75,
        },
        {
          id: 105,
          name: "Strawberries",
          price: 3.49,
          originalPrice: 4.49,
          description: "Sweet and juicy",
          image:
            "https://tse3.mm.bing.net/th?id=OIP.WSsapuZAnvVzcbWhxj68mAHaE8&pid=Api&P=0&h=220",
          isOrganic: false,
          soldCount: 150,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image:
            "https://www.tastingtable.com/img/gallery/15-types-of-blueberries-and-what-makes-them-unique/l-intro-1656439699.jpg",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image:
            "https://images.freeimages.com/images/large-previews/3cc/blueberries-1325514.jpg",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image: "https://placehold.co/300x300?text=Blueberries",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image: "https://placehold.co/300x300?text=Blueberries",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image: "https://placehold.co/300x300?text=Blueberries",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image: "https://placehold.co/300x300?text=Blueberries",
          isOrganic: true,
          soldCount: 95,
        },
        {
          id: 106,
          name: "Organic Blueberries",
          price: 4.99,
          originalPrice: 5.99,
          description: "Antioxidant-rich",
          image: "https://placehold.co/300x300?text=Blueberries",
          isOrganic: true,
          soldCount: 95,
        },
      ],
    },
    {
      id: 2,
      name: "Green Grocers",
      products: [
        {
          id: 201,
          name: "Organic Spinach",
          price: 3.99,
          originalPrice: 4.99,
          description: "Locally grown",
          image: "https://placehold.co/300x300?text=Spinach",
          isOrganic: true,
          soldCount: 65,
        },
        {
          id: 202,
          name: "Tomatoes (1 lb)",
          price: 2.99,
          originalPrice: 3.49,
          description: "Vine ripened",
          image: "https://placehold.co/300x300?text=Tomatoes",
          isOrganic: false,
          soldCount: 110,
        },
        {
          id: 203,
          name: "Cucumbers",
          price: 1.49,
          originalPrice: 1.99,
          description: "Crisp and fresh",
          image: "https://placehold.co/300x300?text=Cucumbers",
          isOrganic: false,
          soldCount: 90,
        },
        {
          id: 204,
          name: "Organic Bell Peppers",
          price: 2.49,
          originalPrice: 3.49,
          description: "Colorful and sweet",
          image: "https://placehold.co/300x300?text=Bell+Peppers",
          isOrganic: true,
          soldCount: 60,
        },
        {
          id: 205,
          name: "Avocados",
          price: 1.99,
          originalPrice: 2.49,
          description: "Creamy and delicious",
          image: "https://placehold.co/300x300?text=Avocados",
          isOrganic: false,
          soldCount: 180,
        },
        {
          id: 206,
          name: "Organic Zucchini",
          price: 1.79,
          originalPrice: 2.29,
          description: "Versatile summer squash",
          image: "https://placehold.co/300x300?text=Zucchini",
          isOrganic: true,
          soldCount: 70,
        },
      ],
    },
  ]);


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
