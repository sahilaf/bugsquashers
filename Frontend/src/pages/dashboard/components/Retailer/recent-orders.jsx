// RecentOrders.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    product: "",
    category: "",
    quantity: 1,
    price: "",
  });

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/retailer-orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Handle input changes for new order form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Add new order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/retailer-orders", {
        ...newOrder,
        price: `$${parseFloat(newOrder.price).toFixed(2)}`, // Ensure price format
      });
      setOrders([...orders, response.data]);
      setNewOrder({ product: "", category: "", quantity: 1, price: "" }); // Reset form
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  };

  return (
    <Card className="border border-muted">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form to Add New Order */}
        <form onSubmit={handleAddOrder} className="mb-6 grid grid-cols-5 gap-4">
          <input
            type="text"
            name="product"
            value={newOrder.product}
            onChange={handleInputChange}
            placeholder="Product"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="category"
            value={newOrder.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newOrder.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            className="border p-2 rounded"
            min="1"
            required
          />
          <input
            type="number"
            name="price"
            value={newOrder.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="border p-2 rounded"
            step="0.01"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Order
          </button>
        </form>

        {/* Table Header */}
        <div className="grid grid-cols-4 text-sm font-medium text-gray-500 mb-2">
          <div>Item</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Price</div>
          <div className="text-center">Total</div>
        </div>

        {/* Scrollable Orders List */}
        <div className="overflow-y-auto max-h-[400px]">
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="grid grid-cols-4 items-center">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{order.product}</div>
                    <div className="text-xs text-gray-500">{order.category}</div>
                  </div>
                </div>
                <div className="text-center">x{order.quantity}</div>
                <div className="text-center">{order.price}</div>
                <div className="text-center">{order.total}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}