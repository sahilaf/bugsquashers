import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Progress } from "../../../../components/ui/progress";
import { Users } from "lucide-react";
// ReviewsDashboard Component
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

function StatisticsDashboard() {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Monthly Sales</CardTitle>
            <CardDescription>Revenue for the last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2 pt-4">
              {demoStats.monthlySales.map((item) => {
                const height = (item.amount / 10000) * 100;
                return (
                  <div key={item.month} className="flex flex-col items-center gap-2">
                    <div className="w-16 bg-primary rounded-t-md" style={{ height: `${height}%` }}></div>
                    <div className="text-sm font-medium">{item.month}</div>
                    <div className="text-sm text-muted-foreground">${item.amount}</div>
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
              {demoStats.cropDistribution.map((item) => (
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
                  We&apos;re working on gathering more detailed customer insights for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  export default StatisticsDashboard;