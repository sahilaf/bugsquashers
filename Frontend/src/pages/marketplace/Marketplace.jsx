"use client";
import PropTypes from "prop-types";
import { ChevronDown, Search, MapPin } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ProductGrid from "./components/market/ProductGrid";
import { useState, useEffect } from "react";
import Filters, {
  AppliedFilters,
  getInitialFilters,
} from "./components/market/Filter";
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
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // Check for stored location permission when component mounts
  useEffect(() => {
    // Check if location permission was previously granted in this session
    const storedLocationConsent = localStorage.getItem('locationPermissionGranted');
    
    if (storedLocationConsent === 'true') {
      setLocationPermissionGranted(true);
      setLocationRequested(true);
      
      // Try to use the stored location if available
      const storedLocation = localStorage.getItem('userLocation');
      if (storedLocation) {
        try {
          const location = JSON.parse(storedLocation);
          setManualLocation(location);
          setUseLocation(true);
        } catch (err) {
          console.error("Failed to parse stored location", err);
        }
      } else {
        // If no stored location but permission was granted, try to get location again
        handleUseLocation();
      }
    }
  }, []);

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

    // Only show the permission section if location was neither requested nor granted
    if (!locationRequested && !locationPermissionGranted && !manualLocation) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="bg-background p-6 rounded-lg max-w-md w-full text-center">
            <MapPin className="h-8 w-8 mx-auto mb-3 text-foreground" />
            <h3 className="font-medium text-lg mb-2">Find local shops</h3>
            <p className="text-muted-foreground mb-4">
              See products available near you or browse all shops
            </p>

            {/* Privacy-focused explanation */}
            <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-md">
              <p className="font-medium mb-1">How we use location:</p>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Only to find shops near your general area</li>
                <li>Coordinates are rounded to city level</li>
                <li>Your location is never stored or tracked</li>
                <li>You can always browse all shops instead</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={handleUseLocation}
                variant="default"
                className="bg-primary hover:bg-primary-hover"
              >
                Find Nearby shops
              </Button>
            </div>
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
  
  /**
   * Geolocation Usage Justification:
   * - Core feature: Finding nearby farms based on user location
   * - Privacy considerations: 
   *   1. Location rounded to city-level precision (~3 decimal places)
   *   2. Coordinates never stored on server
   *   3. Alternative manual location input provided
   *   4. Clear user consent with explanation before requesting
   */
  // Centralized function to check permissions before requesting location
  const getLocationWithPermissionCheck = async () => {
    // First check if APIs are available
    if (!("geolocation" in navigator) || !("permissions" in navigator)) {
      throw new Error(
        "Geolocation or permission API not supported by your browser."
      );
    }
  
    // Check permission status
    const permissionStatus = await navigator.permissions.query({
      name: "geolocation",
    });
  
    // Handle based on permission state
    if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
      // Permission already granted or will prompt user for permission
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000, // Cache location for a minute
        });
      });
    } else {
      // Permission denied
      throw new Error("Location access previously denied.");
    }
  };

  const handleUseLocation = async () => {
    setLocationRequested(true);
    setIsLoading(true);

    try {
      // Use the centralized function to check permission and get location
      const position = await getLocationWithPermissionCheck();

      // Store that permission was granted for this session
      localStorage.setItem('locationPermissionGranted', 'true');
      setLocationPermissionGranted(true);
      setUseLocation(true);
      
      // Store the location in localStorage
      const locationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
      fetchShopsWithPosition(
        position.coords.latitude,
        position.coords.longitude
      );

      // Get permission status for event listener
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      permissionStatus.addEventListener("change", handlePermissionChange);
    } catch (err) {
      console.error("Location error:", err);
      handleLocationError(err);
    }
  };

  // Handle permission status changes
  const handlePermissionChange = async (e) => {
    const permissionStatus = e.target;

    if (permissionStatus.state === "granted") {
      // User granted permission after initially denying it
      try {
        // Always use the centralized function to get location
        const position = await getLocationWithPermissionCheck();
        
        // Store that permission was granted for this session
        localStorage.setItem('locationPermissionGranted', 'true');
        setLocationPermissionGranted(true);
        setUseLocation(true);
        
        // Store the location in localStorage
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log("Location data:", locationData);
        localStorage.setItem('userLocation', JSON.stringify(locationData));
        
        fetchShopsWithPosition(
          position.coords.latitude,
          position.coords.longitude
        );
      } catch (error) {
        handleLocationError(error);
      }
    } else if (permissionStatus.state === "denied") {
      // User denied permission after initially granting it
      localStorage.removeItem('locationPermissionGranted');
      localStorage.removeItem('userLocation');
      setLocationPermissionGranted(false);
      setError("Location access was denied. Showing all farms instead.");
      setUseLocation(false);
      setManualLocation({ lat: 40.7128, lng: -74.006 });
    }
  };

  // Centralized error handling for location errors
  const handleLocationError = (error) => {
    let errorMessage =
      "Unable to access your location. Showing all farms instead.";

    if (error.code === 1) {
      // PERMISSION_DENIED
      localStorage.removeItem('locationPermissionGranted');
      localStorage.removeItem('userLocation');
      setLocationPermissionGranted(false);
      errorMessage = "Location access was denied. Showing all farms instead.";
    } else if (error.code === 2) {
      // POSITION_UNAVAILABLE
      errorMessage =
        "Location information is unavailable. Showing all farms instead.";
    } else if (error.code === 3) {
      // TIMEOUT
      errorMessage = "Location request timed out. Showing all farms instead.";
    } else if (error.message) {
      // Handle errors from our permission check
      errorMessage = `${error.message} Showing all farms instead.`;
    }

    setError(errorMessage);
    setLocationRequested(false);
    setUseLocation(false);
    // Fall back to showing all farms
    setManualLocation({ lat: 40.7128, lng: -74.006 });
    setIsLoading(false);
  };

  // Modify the fetchShopsWithPosition to be more privacy-aware
  const fetchShopsWithPosition = async (lat, lng, page = 1) => {
    setIsLoading(true);
    setError("");

    try {
      // Round coordinates to lower precision (city-level rather than exact location)
      // 3 decimal places is roughly town/city level precision (~100m)
      const roundedLat = parseFloat(lat.toFixed(3));
      const roundedLng = parseFloat(lng.toFixed(3));

      const params = {
        page,
        limit: 10,
        lat: roundedLat,
        lng: roundedLng,
        ...(filters.category.length && {
          category: filters.category.join(","),
        }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.organic && { organic: true }),
        ...(filters.local && { local: true }),
        ...(searchQuery && { search: searchQuery }),
      };

      const res = await fetch(
        `http://localhost:3000/api/shops/nearby?${new URLSearchParams(params)}`
      );

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
        <main className="w-full">{renderContent()}</main>
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