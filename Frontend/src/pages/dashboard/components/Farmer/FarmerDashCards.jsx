import { Star, ShoppingCart, BarChart3, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent
} from "../../../../components/ui/card";
import PropTypes from "prop-types";


const demoStats = {
  totalRevenue: "$12,500",
  totalOrders: 48,
  averageRating: 4.7,
  topCrop: "Wheat",
  monthlySales: [
    { month: "Jan", amount: 5200 },
    { month: "Feb", amount: 7800 },
    { month: "Mar", amount: 9500 },
  ],
  cropDistribution: [
    { crop: "Wheat", percentage: 40 },
    { crop: "Rice", percentage: 25 },
    { crop: "Corn", percentage: 20 },
    { crop: "Others", percentage: 15 },
  ],
};
// StatCard Component
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={demoStats.totalRevenue}
          description="Last 30 days"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          trend="+12.5%"
          trendDirection="up"
        />
        <StatCard
          title="Total Orders"
          value={demoStats.totalOrders.toString()}
          description="Last 30 days"
          icon={<ShoppingCart className="h-4 w-4 text-blue-500" />}
          trend="+8.2%"
          trendDirection="up"
        />
        <StatCard
          title="Average Rating"
          value={demoStats.averageRating.toString()}
          description="From 27 reviews"
          icon={<Star className="h-4 w-4 text-yellow-500" />}
          trend="+0.3"
          trendDirection="up"
        />
        <StatCard
          title="Top Selling Crop"
          value={demoStats.topCrop}
          description="By volume"
          icon={<BarChart3 className="h-4 w-4 text-purple-500" />}
          trend="Consistent"
          trendDirection="neutral"
        />
      </div>
  )
}

export default FarmerDashCards