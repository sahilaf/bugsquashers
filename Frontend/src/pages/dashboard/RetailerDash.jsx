"use client"
import { useState } from "react"
import { BarChart3, Home, Package, Settings, Star,History } from "lucide-react"
import { RecentOrders } from "./components/Retailer/recent-orders"
import { Button } from "../../components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../../components/ui/sidebar"
import Overview from "./components/Retailer/Overview"
import { ReviewsDashboard } from "./components/Retailer/Review"
import { StatisticsDashboard } from "./components/Retailer/StatisticsDashboard"
import PurchaseHistory from "./components/Retailer/PurchaseHistory"
import ProductInventory from "./components/Retailer/ProductInventory"
import ShopDetails from "./components/Retailer/ShopDetails"

function RetailerDash() {
  const [activeSection, setActiveSection] = useState("Overview") // Track active section

  // Sidebar menu items with labels and corresponding component mapping
  const menuItems = [
    { label: "Overview", icon: Home, component: <Overview /> },
    { label: "Shop detail", icon: History, component: <ShopDetails /> },
    { label: "Statistics", icon: BarChart3, component: <StatisticsDashboard /> },
    { label: "Products", icon: Package, component: <ProductInventory /> },
    { label: "Orders", icon: Settings, component: <RecentOrders /> },
    { label: "Purchase history", icon: History, component: <PurchaseHistory /> },
    { label: "Reviews", icon: Star, component: <ReviewsDashboard /> },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex mt-[68px] border-t  overflow-x-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex border-r mt-[68px] border-t ">
          <SidebarContent className="p-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.label)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-all flex items-center gap-3 ${
                      activeSection === item.label ? "bg-primary hover:bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Top Navigation */}
        <div className="md:hidden fixed pt-[68px] py-2 top-0 left-0 right-0 bg-background border border-b  z-40">
          <div className="flex overflow-x-auto p-2 space-x-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                variant={activeSection === item.label ? "default" : "outline"}
                size="sm"
                className="flex-shrink-0 text-foreground"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-background lg:w-[86vw] w-full mt-16 md:mt-0">
          <main className="p-4 lg:p-6 space-y-6">
            {/* Render selected component dynamically */}
            {menuItems.find((item) => item.label === activeSection)?.component}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default RetailerDash