import { useState, React } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import { ShoppingCart, TreesIcon as Plant, Star, BarChart3 } from "lucide-react";
import OrdersDashboard from "./OrdersDashboard";
import CropsDashboard from "./CropsDashboard";
import ReviewsDashboard from "./ReviewsDashboard";
import StatisticsDashboard from "./StatisticsDashboard";

function TabSection() {
  // Initialize with proper structure or null
  const [crops, setCrops] = useState([]);

  const handleEditCrop = (crop) => {
    setSelectedCrop(crop);
    setIsDialogOpen(true);
  };

  // Add a function to handle viewing all crops if needed
  const handleViewAll = () => {
    // Implement view all functionality
  };

  return (
    <div>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="crops">
            <Plant className="mr-2 h-4 w-4" />
            Crops
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="mr-2 h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <OrdersDashboard />
        </TabsContent>
        <TabsContent value="crops" className="space-y-4">
          <CropsDashboard
            crops={crops}
            setCrops={setCrops}
            onEditCrop={handleEditCrop}
            onViewAll={handleViewAll}
          />
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <ReviewsDashboard />
        </TabsContent>
        <TabsContent value="statistics" className="space-y-4">
          <StatisticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TabSection;