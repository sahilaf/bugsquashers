"use client";
import PropTypes from "prop-types";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ProductGrid from "./components/market/ProductGrid";
import { useState, useEffect } from "react";
import Filters, { AppliedFilters, getInitialFilters } from "./components/market/Filter";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../../components/ui/drawer";

function MarketPlace() {
  const [filters, setFilters] = useState(getInitialFilters());
  const [nearbyShops, setNearbyShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");



  const renderContent = () => {
    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }
    
    if (isLoading) {
      return <div className="text-center py-8">Loading shops...</div>;
    }
    
    return (
      <ProductGrid 
        shops={nearbyShops} 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  };

  const fetchShops = async (lat, lng, page = 1) => {
    setIsLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        page,
        limit: 10,
        ...(filters.category.length && { category: filters.category.join(",") }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.organic && { organic: true }),
        ...(filters.local && { local: true }),
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(
        `http://localhost:3000/api/shops/nearby?${params}`
      );
      
      if (!res.ok) throw new Error('Failed to fetch shops');
      
      const data = await res.json();
      
      if (data.success) {
        setNearbyShops(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        throw new Error(data.error || 'Failed to fetch shops');
      }
    } catch (err) {
      console.error("Failed to fetch shops", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchShops(latitude, longitude);
        },
        (error) => {
          console.error("Location error:", error);
          setError("Please enable location services to view nearby shops");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Re-fetch shops when filters or search changes
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchShops(latitude, longitude, 1); // Reset to page 1 when filters change
        },
        (error) => {
          console.error("Location error:", error);
        }
      );
    }
  }, [filters, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Add debounce if needed
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchShops(latitude, longitude, newPage);
      },
      (error) => console.error("Location error:", error)
    );
  };

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
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto md:max-w-md my-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rounded-full" />
            <Input
              placeholder="Search shops..."
              className="pl-9 pr-4 py-2 h-9 rounded-full bg-muted w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="hidden md:block">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </header>

      {/* Applied Filters */}
      <AppliedFilters filters={filters} setFilters={setFilters} />

      <div className="py-4 md:py-6 w-full">
        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
// Add safe default values in the prop validation
Filters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.array,
    delivery: PropTypes.array,
    rating: PropTypes.string,
    organic: PropTypes.bool,
    local: PropTypes.bool,
  }),
  setFilters: PropTypes.func,
  mobile: PropTypes.bool,
};

Filters.defaultProps = {
  filters: getInitialFilters(),
  setFilters: () => {},
  mobile: false,
};

// Do the same for AppliedFilters
AppliedFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.array,
    delivery: PropTypes.array,
    rating: PropTypes.string,
    organic: PropTypes.bool,
    local: PropTypes.bool,
  }),
  setFilters: PropTypes.func,
};

AppliedFilters.defaultProps = {
  filters: getInitialFilters(),
  setFilters: () => {},
};

export default MarketPlace;