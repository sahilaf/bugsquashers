import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { format } from "date-fns";

export function PurchaseHistory() {
  // Demo data array
  const demoData = [
    {
      id: 1,
      product: "Organic Tomatoes",
      farmerName: "Ravi Kumar",
      purchaseDate: "2024-03-15",
      quantity: 150,
      pricePerKg: 25.5,
      totalAmount: 3825,
      status: "Completed"
    },
    {
      id: 2,
      product: "Basmati Rice",
      farmerName: "Priya Sharma",
      purchaseDate: "2024-03-14",
      quantity: 200,
      pricePerKg: 42.75,
      totalAmount: 8550,
      status: "Pending"
    },
    {
      id: 3,
      product: "Alphonso Mangoes",
      farmerName: "Vijay Patil",
      purchaseDate: "2024-03-13",
      quantity: 75,
      pricePerKg: 120.0,
      totalAmount: 9000,
      status: "Completed"
    },
    {
      id: 4,
      product: "Fresh Spinach",
      farmerName: "Anjali Mehta",
      purchaseDate: "2024-03-12",
      quantity: 50,
      pricePerKg: 18.0,
      totalAmount: 900,
      status: "Completed"
    }
  ];

  return (
    <Card className="border ">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Product</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoData.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.product}</TableCell>
                  <TableCell>{purchase.farmerName}</TableCell>
                  <TableCell>
                    {format(new Date(purchase.purchaseDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">{purchase.quantity} kg</TableCell>
                  <TableCell className="text-right">
                    Bdt{purchase.pricePerKg.toLocaleString()}/kg
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Bdt{purchase.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={purchase.status === "Completed" ? "default" : "secondary"}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between font-medium">
            <span>Total Purchases:</span>
            <span>
              Bdt{demoData
                .reduce((sum, purchase) => sum + purchase.totalAmount, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PurchaseHistory;