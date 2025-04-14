import { useState } from "react";
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
import { AddProductDialog } from "./AddProductDialog"; // We'll create this component

export function ProductInventory() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      stock: 45,
      price: 25.5,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Basmati Rice",
      category: "Grains",
      stock: 12,
      price: 85.0,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Fresh Spinach",
      category: "Leafy Greens",
      stock: 0,
      price: 18.0,
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "Alphonso Mangoes",
      category: "Fruits",
      stock: 32,
      price: 120.0,
      status: "In Stock",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusVariants = {
    "In Stock": "default",
    "Low Stock": "secondary",
    "Out of Stock": "destructive",
  };

  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.stock * product.price,
    0
  );

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts([...products, addedProduct]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <Card className="border border-muted">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Inventory Overview</CardTitle>
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {(product.price * product.stock).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[product.status] || "default"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center font-medium text-base">
            <span>Total Inventory Value:</span>
            <span>₹{totalInventoryValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <AddProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddProduct={handleAddProduct}
        />
      </CardContent>
    </Card>
  );
}

export default ProductInventory;