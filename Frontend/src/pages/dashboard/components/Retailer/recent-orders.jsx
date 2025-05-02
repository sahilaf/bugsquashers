import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../../../components/ui/table";
import { useAuth } from "../../../auth/AuthContext";
import useShopDetails from "../../../../hooks/use-shop";
export function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const { userId } = useAuth();
  const { shop, loading: shopLoading, error: shopError } = useShopDetails(userId);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchOrders = async () => {
      if (!shop?._id) return;

      try {
        const response = await axios.get(`${BASE_URL}/api/customer-orders/showshopsorders?shop=${shop._id}`);
        console.log("API Response:", response.data); // Debugging line
        const ordersData = Array.isArray(response.data) ? response.data : [];
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }      
    };

    fetchOrders();
  }, [shop?._id]);

  // Debugging: Log current orders and shop ID
  console.log("Current Orders:", orders);
  console.log("Shop ID:", shop?._id);

  if (shopLoading) return <div>Loading orders...</div>;
  if (shopError) return <div>Failed to load shop details</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Customer Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto max-h-[400px]">
          <Table>
            {/* Table headers remain the same */}
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) =>
                  order.items?.map((item, index) => (
                    <TableRow key={`${order._id}-${index}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{order.shopName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">Bdt{item.price}</TableCell>
                      <TableCell className="text-right">{order.status}</TableCell>
                      <TableCell className="text-right">{order.payment}</TableCell>
                      <TableCell className="text-right">Bdt{order.total}</TableCell>
                    </TableRow>
                  )) ?? (
                    <TableRow key={order._id}>
                      <TableCell colSpan={7} className="text-center">
                        No items in this order.
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}