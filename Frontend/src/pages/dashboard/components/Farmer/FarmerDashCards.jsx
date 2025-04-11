import { useState, useEffect } from "react";
import { ShoppingCart, BarChart3, TrendingUp, UserPlus } from "lucide-react";
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
          <div
            className={`text-sm font-medium flex items-center ${trendColor}`}
          >
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
    const calculateTotal = (orders) => {
      return orders.reduce((sum, order) => {
        const price = parseFloat(order.price || 0);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
    };

    const filterOrdersByDate = (orders, startDate, endDate = new Date()) => {
      return orders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate < endDate;
      });
    };

    const getTrend = (current, previous) => {
      let trendValue;
      if (previous !== 0) {
        const change = ((current - previous) / previous) * 100;
        trendValue = change.toFixed(1);
      } else {
        trendValue = current > 0 ? "100" : "0";
      }

      const numericValue = parseFloat(trendValue);
      let direction;
      if (numericValue > 0) {
        direction = "up";
      } else if (numericValue < 0) {
        direction = "down";
      } else {
        direction = "neutral";
      }

      return { value: trendValue, direction };
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const orders = await response.json();

        // Date calculations
        const now = new Date();
        const last30DaysStart = new Date(now);
        last30DaysStart.setDate(now.getDate() - 30);
        const prev30DaysStart = new Date(last30DaysStart);
        prev30DaysStart.setDate(last30DaysStart.getDate() - 30);

        // Filter orders
        const last30DaysOrders = filterOrdersByDate(orders, last30DaysStart);
        const prev30DaysOrders = filterOrdersByDate(
          orders,
          prev30DaysStart,
          last30DaysStart
        );

        // Calculate totals
        const totalRevenue = calculateTotal(last30DaysOrders);
        const prevTotalRevenue = calculateTotal(prev30DaysOrders);
        const totalOrders = last30DaysOrders.length;
        const prevTotalOrders = prev30DaysOrders.length;

        // Calculate trends
        const revenueTrend = getTrend(totalRevenue, prevTotalRevenue);
        const ordersTrend = getTrend(totalOrders, prevTotalOrders);

        // Calculate top crop
        const cropCounts = last30DaysOrders.reduce((acc, order) => {
          acc[order.crop] = (acc[order.crop] || 0) + 1;
          return acc;
        }, {});
        const topCrop =
          Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "N/A";

        setStats({
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          totalOrders: totalOrders.toString(),
          topCrop,
          trends: {
            revenue: {
              value: `${revenueTrend.value > 0 ? "+" : ""}${
                revenueTrend.value
              }%`,
              direction: revenueTrend.direction,
            },
            orders: {
              value: `${ordersTrend.value > 0 ? "+" : ""}${ordersTrend.value}%`,
              direction: ordersTrend.direction,
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
      <StatCard
        title="New Customers"
        value="300+"
        description="Joined in last 30 days"
        icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
        trend="Consistent"
        trendDirection="neutral"
      />
    </div>
  );
}

export default FarmerDashCards;
