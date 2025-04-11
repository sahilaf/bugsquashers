"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ProductGrid from "./components/market/ProductGrid";
import { useState } from "react";
import Filters, { AppliedFilters } from "./components/market/Filter";
import { Drawer, DrawerContent, DrawerTrigger } from "../../components/ui/drawer";

function MarketPlace() {
  const [filters, setFilters] = useState({
    category: [],
    delivery: [],
    rating: "",
    organic: false,
    local: false,
  });

  return (
    <div className="min-h-screen bg-background mt-20 lg:px-32 px-4">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10 py-2 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 w-full">
          {/* Mobile Filter Button and Categories */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 md:hidden flex items-center gap-1"
                >
                  <span>Filters</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-4">
                <Filters filters={filters} setFilters={setFilters} mobile />
              </DrawerContent>
            </Drawer>

            {/* Desktop Categories */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="text-sm">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="text-sm hidden lg:flex">
                Ready to ship
              </Button>
              <Button variant="ghost" className="text-sm hidden lg:flex">
                Organic
              </Button>
              <Button variant="ghost" className="text-sm hidden xl:flex">
                Local Farms
              </Button>
            </div>
          </div>

          {/* Search Bar and Filter Button */}
          <div className="flex items-center gap-2 w-full md:w-auto md:max-w-md my-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rounded-full" />
              <Input
                placeholder="Search shops..."
                className="pl-9 pr-4 py-2 h-9 rounded-full bg-muted w-full"
              />
            </div>
            <div className="hidden md:block">
              <Filters filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>
      </header>

      {/* Applied Filters */}
      <AppliedFilters filters={filters} setFilters={setFilters} />

      <div className="py-4 md:py-6 w-full">
        <main className="w-full">
          <ProductGrid />
        </main>
      </div>
    </div>
  );
}

export default MarketPlace;