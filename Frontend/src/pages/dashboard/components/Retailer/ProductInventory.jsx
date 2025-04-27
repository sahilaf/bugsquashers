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
          `http://localhost:3000/api/products?shop=${shop._id}`
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

      const response = await fetch("http://localhost:3000/api/products/", {
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

  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );

  // Loading and error states
  if (shopLoading || isLoading) return <div>Loading...</div>;
  if (shopError) return <div>Error loading shop: {shopError}</div>;
  if (!shop) return <div>No shop found</div>;

  return (
    <Card className="border">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">
          Inventory Overview
        </CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Unit Price (₹)</TableHead>
                <TableHead className="text-right">Total Value (₹)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => {
                const status = getProductStatus(product.quantity);
                return (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(product.price * product.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[status]}>
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center font-medium text-base">
            <span>Total Inventory Value:</span>
            <span>
              ₹{totalInventoryValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <AddProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddProduct={handleAddProduct}
          shopId={shop._id}
        />
      </CardContent>
    </Card>
  );
}

export default ProductInventory;
