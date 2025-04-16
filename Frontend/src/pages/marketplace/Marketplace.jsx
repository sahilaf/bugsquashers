"use client";
import PropTypes from "prop-types";
import { ChevronDown, Search, MapPin } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

function MarketPlace() {
  const [filters, setFilters] = useState(getInitialFilters());
  const [nearbyShops, setNearbyShops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [useLocation, setUseLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const renderContent = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (isLoading) {
      return <div className="text-center py-8">Loading shops...</div>;
    }

    if (!locationRequested && !manualLocation) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="bg-background p-6 rounded-lg max-w-md w-full text-center">
            <MapPin className="h-8 w-8 mx-auto mb-3 text-foreground" />
            <h3 className="font-medium text-lg mb-2">Find local farmers</h3>
            <p className="text-muted-foreground mb-4">
              See products available near you or browse all farms
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                onClick={handleUseLocation}
                variant="default"
                className="bg-primary hover:bg-primary-hover"
              >
                Use My Location
              </Button>
              <Button 
                onClick={() => setManualLocation({ lat: 40.7128, lng: -74.0060 })}
                variant="outline"
              >
                Browse All Farms
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Your location is only used to find nearby shops and isn't stored.
            </p>
          </div>
        </div>
      );
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

  const handleUseLocation = async () => {
    setLocationRequested(true);

    const userUnderstands = window.confirm(
      "We use your location to find nearby farms. Your location is never stored. Do you want to proceed?"
    );

    if (!userUnderstands) {
      setLocationRequested(false);
      return;
    }

    if (!("geolocation" in navigator) || !("permissions" in navigator)) {
      setError("Geolocation or permission API not supported by your browser.");
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUseLocation(true);
            setIsLoading(true); // 👈 Show loading right after permission is granted
            fetchShopsWithPosition(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            if (error.code === error.PERMISSION_DENIED) {
              setError("Location access denied. Please enable permissions in browser settings or browse all farms.");
            } else {
              setError("Unable to access your location. Please try again.");
            }
            setLocationRequested(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        setError("Geolocation permission denied. You can browse all farms instead.");
        setUseLocation(false);
        setLocationRequested(false);
      }
    } catch (err) {
      console.error("Permission query error:", err);
      setError("Failed to check location permission. Please try again.");
      setLocationRequested(false);
    }
  };

  const fetchShopsWithPosition = async (lat, lng, page = 1) => {
    setIsLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        ...(filters.category.length && { category: filters.category.join(",") }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.organic && { organic: true }),
        ...(filters.local && { local: true }),
        ...(searchQuery && { search: searchQuery }),
      };

      const res = await fetch(`http://localhost:3000/api/shops/nearby?${new URLSearchParams(params)}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch shops");
      }

      const data = await res.json();

      if (data.success) {
        setNearbyShops(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        throw new Error(data.error || "Failed to fetch shops");
      }
    } catch (err) {
      console.error("Failed to fetch shops", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (useLocation || manualLocation) {
      const lat = manualLocation?.lat;
      const lng = manualLocation?.lng;
      if (lat != null && lng != null) {
        fetchShopsWithPosition(lat, lng, currentPage);
      }
    }
  }, [filters, searchQuery, useLocation, manualLocation, locationRequested]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    const location = manualLocation;
    if (location) {
      fetchShopsWithPosition(location.lat, location.lng, newPage);
    }
  };

  return (
    <div className="min-h-screen bg-background mt-20 lg:px-32 px-4">
      <header className="border-b sticky top-0 bg-background z-10 py-2 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 w-full">
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

      {(useLocation || manualLocation) && (
        <AppliedFilters filters={filters} setFilters={setFilters} />
      )}

      <div className="py-4 md:py-6 w-full">
        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

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
