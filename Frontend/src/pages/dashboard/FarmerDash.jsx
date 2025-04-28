"use client";
import FarmerDashCards from "./components/Farmer/FarmerDashCards";
import FarmerDashHeader from "./components/Farmer/FarmerDashHeader";
import TabSection from "./components/Farmer/TabSection";
export default function FarmerDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6 bg-background pt-24 min-h-screen">
      <FarmerDashHeader/>
      <FarmerDashCards/>
      <TabSection/>
    </div>
  );
}
