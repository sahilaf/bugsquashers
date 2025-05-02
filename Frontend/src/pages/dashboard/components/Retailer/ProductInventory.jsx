import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import { AddProductDialog } from "./AddProductDialog";
import { useToast } from "../../../../hooks/use-toast";
import { useAuth } from "../../../../pages/auth/AuthContext";
import useShopDetails from "../../../../hooks/use-shop";

// Map inventory status to badge variants
const statusVariants = {
  "Out of Stock": "destructive", // red
  "Low Stock": "outline",        // neutral/outline
  "In Stock": "default",        // default style
};

export function ProductInventory() {
  const { userId } = useAuth();
  const { shop, loading: shopLoading, error: shopError } = useShopDetails(userId);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch products when shop is loaded
  useEffect(() => {
    if (!shop?._id) {
      setIsLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/products?shop=${shop._id}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch products");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid products data format");
        }
        setProducts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [shop?._id, toast]);

  // Determine product status label
  const getProductStatus = (quantity) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= 10) return "Low Stock";
    return "In Stock";
  };

  // Handle adding a new product
  const handleAddProduct = async (newProduct) => {
    try {
      if (!shop?._id) {
        throw new Error("No shop associated");
      }

      const response = await fetch(`${BASE_URL}/api/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          shop: shop._id,
          quantity: Number(newProduct.quantity),
          price: Number(newProduct.price),
          originalPrice:
            Number(newProduct.originalPrice) || Number(newProduct.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Product added successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  

  // Loading and error states
  if (shopLoading || isLoading) return <div>Loading...</div>;
  if (shopError) return <div>Error loading shop: {shopError}</div>;
  if (!shop) return <div>No shop found</div>;
  let content;

if (isLoading) {
  content = <div className="text-center py-8">Loading products...</div>;
} else if (shopError) {
  content = (
    <div className="text-center py-8 text-destructive">
      Failed to load products.
    </div>
  );
} else if (products.length === 0) {
  content = <div className="text-center py-8">No products found.</div>;
} else {
  content = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price (Bdt)</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.price.toFixed(2)}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              <Badge variant={statusVariants[getProductStatus(product.quantity)]}>
                {getProductStatus(product.quantity)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Product Inventory</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </CardHeader>
  
      <CardContent>
        {content}
      </CardContent>
  
      <AddProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddProduct={handleAddProduct}
        shopId={shop?._id}
      />
    </Card>
  );
}

export default ProductInventory;