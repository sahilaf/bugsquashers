import { useState, useEffect } from "react";
import { ShoppingCart, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import PropTypes from "prop-types";

function StatCard({ title, value, description, icon, trend, trendDirection }) {
  let trendColor = "text-gray-500";
  let trendIcon = null;

  if (trendDirection === "up") {
    trendColor = "text-green-500";
    trendIcon = <TrendingUp className="ml-1 h-3 w-3" />;
  } else if (trendDirection === "down") {
    trendColor = "text-red-500";
    trendIcon = <TrendingUp className="ml-1 h-3 w-3 rotate-180" />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-muted p-2">{icon}</div>
          <div className={`text-sm font-medium flex items-center ${trendColor}`}>
            {trend}
            {trendIcon}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  trend: PropTypes.string.isRequired,
  trendDirection: PropTypes.oneOf(["up", "down", "neutral"]).isRequired,
};

function FarmerDashCards() {
  const [stats, setStats] = useState({
    totalRevenue: "$0",
    totalOrders: "0",
    topCrop: "N/A",
    trends: {
      revenue: { value: "0%", direction: "neutral" },
      orders: { value: "0%", direction: "neutral" },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const orders = await response.json();
        console.log("Fetched orders:", orders); // Log raw data

        // Date ranges
        const now = new Date();
        const last30DaysStart = new Date(now);
        last30DaysStart.setDate(now.getDate() - 30);
        const prev30DaysStart = new Date(last30DaysStart);
        prev30DaysStart.setDate(last30DaysStart.getDate() - 30);

        // Filter orders
        const last30DaysOrders = orders.filter((order) => new Date(order.date) >= last30DaysStart);
        const prev30DaysOrders = orders.filter(
          (order) => new Date(order.date) >= prev30DaysStart && new Date(order.date) < last30DaysStart
        );

        // Debug prices
        console.log("Last 30 days orders:", last30DaysOrders);
        last30DaysOrders.forEach((order, index) => {
          console.log(`Order ${index} price:`, order.price, "Parsed:", parseFloat(order.price || 0));
        });

        // Current period stats
        const totalRevenue = last30DaysOrders.reduce(
          (sum, order) => {
            const price = parseFloat(order.price || 0);
            return sum + (isNaN(price) ? 0 : price); // Fallback to 0 if NaN
          },
          0
        );
        console.log("Calculated totalRevenue:", totalRevenue); // Log result

        const totalOrders = last30DaysOrders.length;

        const cropCounts = last30DaysOrders.reduce((acc, order) => {
          acc[order.crop] = (acc[order.crop] || 0) + 1;
          return acc;
        }, {});
        const topCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

        // Previous period stats for trends
        const prevTotalRevenue = prev30DaysOrders.reduce(
          (sum, order) => {
            const price = parseFloat(order.price || 0);
            return sum + (isNaN(price) ? 0 : price);
          },
          0
        );
        const prevTotalOrders = prev30DaysOrders.length;

        // Calculate trends
        const revenueTrend = prevTotalRevenue
          ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(1)
          : totalRevenue > 0
          ? "100"
          : "0";
        const ordersTrend = prevTotalOrders
          ? (((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(1)
          : totalOrders > 0
          ? "100"
          : "0";

        setStats({
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          totalOrders: totalOrders.toString(),
          topCrop,
          trends: {
            revenue: {
              value: `${revenueTrend > 0 ? "+" : ""}${revenueTrend}%`,
              direction: revenueTrend > 0 ? "up" : revenueTrend < 0 ? "down" : "neutral",
            },
            orders: {
              value: `${ordersTrend > 0 ? "+" : ""}${ordersTrend}%`,
              direction: ordersTrend > 0 ? "up" : ordersTrend < 0 ? "down" : "neutral",
            },
          },
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={stats.totalRevenue}
        description="Last 30 days"
        icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        trend={stats.trends.revenue.value}
        trendDirection={stats.trends.revenue.direction}
      />
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        description="Last 30 days"
        icon={<ShoppingCart className="h-4 w-4 text-blue-500" />}
        trend={stats.trends.orders.value}
        trendDirection={stats.trends.orders.direction}
      />
      <StatCard
        title="Top Selling Crop"
        value={stats.topCrop}
        description="By volume, last 30 days"
        icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
        trend="Consistent"
        trendDirection="neutral"
      />
    </div>
  );
}

export default FarmerDashCards;