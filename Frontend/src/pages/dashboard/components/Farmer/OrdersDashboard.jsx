import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Loader2, RefreshCw, Clipboard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // proper state destructuring
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleCancelOrder = (id) => {
    alert(`Viewing order ${id}`);
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "warning";
      case "Pending":
        return "default";
      default:
        return "default";
    }
  };

  const renderOrderRows = () => {
    if (loading) {
      return [
        <TableRow key="loading">
          <TableCell colSpan={9} className="text-center py-8">
            <Loader2 className="animate-spin mx-auto h-6 w-6" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading orders...
            </p>
          </TableCell>
        </TableRow>,
      ];
    }

    if (orders.length === 0) {
      return [
        <TableRow key="empty">
          <TableCell colSpan={9} className="text-center py-8">
            <Clipboard className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              No orders found.
            </p>
          </TableCell>
        </TableRow>,
      ];
    }

    return orders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="font-medium">{order.id}</TableCell>
        <TableCell>{order.crop}</TableCell>
        <TableCell>{order.quantity}</TableCell>
        <TableCell>{order.price}</TableCell>
        <TableCell>{order.date}</TableCell>
        <TableCell>{order.address}</TableCell>
        <TableCell>
          <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
        </TableCell>
        <TableCell>
          <Badge
            variant={order.paymentStatus === "Paid" ? "success" : "warning"}
          >
            {order.paymentStatus || "Pending"}
          </Badge>
        </TableCell>
        <TableCell>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCancelOrder(order.id)}
          >
            Cancel Order
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md mb-4">
          {error}
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription>
              Manage and track your customer orders
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Cancel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderOrderRows()}</TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {orders.length} of {orders.length} orders
        </p>
        <Button variant="outline" size="sm">
          View All Orders
        </Button>
      </CardFooter>
    </Card>
  );
}

export default OrdersDashboard;
