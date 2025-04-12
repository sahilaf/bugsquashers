// RecentOrders.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

const OrderStatus = ({ status }) => {
  const statusStyles = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={statusStyles[status] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.oneOf(["Delivered", "Processing", "Shipped", "Cancelled"]).isRequired,
};

const RecentOrders = ({ fullList = false, customerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customer-orders");
        // Filter orders by customerId if provided
        const filteredOrders = customerId
          ? response.data.filter((order) => order.customerId === customerId)
          : response.data;
        setOrders(filteredOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/customer-orders/${orderId}/cancel`
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      setError("Failed to cancel order");
    }
  };

  const displayOrders = fullList ? orders : orders.slice(0, 3);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>You have {orders.length} total orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Shop Name</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cancel Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.shopName}</TableCell>
                <TableCell>
                  {order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    className="rounded-sm"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={order.status === "Cancelled" || order.status === "Delivered"}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

RecentOrders.propTypes = {
  fullList: PropTypes.bool,
  customerId: PropTypes.string,
};

export default RecentOrders;