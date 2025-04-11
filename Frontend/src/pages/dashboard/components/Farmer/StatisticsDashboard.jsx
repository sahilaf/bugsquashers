import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Users } from "lucide-react";

function StatisticsDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 10,
    totalOrders: 0,
    topCrop: "",
    monthlySales: [],
    cropDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders"); // Adjust URL as needed
        const orders = await response.json();

        // Process data
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0);
        const totalOrders = orders.length;

        // Monthly sales (last 3 months)
        const monthlySales = [];
        const now = new Date();
        for (let i = 2; i >= 0; i--) {
          const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthOrders = orders.filter((order) => {
            const orderDate = new Date(order.date);
            return (
              orderDate.getMonth() === monthDate.getMonth() &&
              orderDate.getFullYear() === monthDate.getFullYear()
            );
          });
          monthlySales.push({
            month: monthDate.toLocaleString("default", { month: "short" }),
            amount: monthOrders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0),
          });
        }

        // Crop distribution
        const cropCounts = orders.reduce((acc, order) => {
          acc[order.crop] = (acc[order.crop] || 0) + 1;
          return acc;
        }, {});
        const totalCrops = Object.values(cropCounts).reduce((sum, count) => sum + count, 0);
        const cropDistribution = Object.entries(cropCounts).map(([crop, count]) => ({
          crop,
          percentage: Math.round((count / totalCrops) * 100),
        }));
        const topCrop = cropDistribution.sort((a, b) => b.percentage - a.percentage)[0]?.crop || "";

        setStats({
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          totalOrders,
          topCrop,
          monthlySales,
          cropDistribution,
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Monthly Sales</CardTitle>
          <CardDescription>Revenue for the last 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
            {stats.monthlySales.map((item) => {
              const maxAmount = Math.max(...stats.monthlySales.map((sale) => sale.amount), 1000); // Avoid division by zero
              const height = (item.amount / maxAmount) * 100; // Scale dynamically
              return (
                <div key={item.month} className="flex flex-col items-center gap-2">
                  <div className="w-16 bg-primary rounded-t-md" style={{ height: `${height}%` }}></div>
                  <div className="text-sm font-medium">{item.month}</div>
                  <div className="text-sm text-muted-foreground">${item.amount.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Crop Distribution</CardTitle>
          <CardDescription>Sales distribution by crop type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.cropDistribution.map((item) => (
              <div key={item.crop} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.crop}</span>
                  <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Customer Demographics</CardTitle>
          <CardDescription>Information about your customer base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">Customer data visualization coming soon</p>
              <p className="text-sm text-muted-foreground mt-1">
                We're working on gathering more detailed customer insights for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatisticsDashboard;