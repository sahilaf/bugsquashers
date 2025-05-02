"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Pencil,
  Save,
  XCircle,
  CheckCircle2,
  Loader2,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";

export function ShopDetails() {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const { userId } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shop, setShop] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const form = useForm({
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      category: "Other",
      isOrganicCertified: false,
      isLocalFarm: false,
    },
  });

  // Fetch ownerId and shop data when component mounts
  // In your useEffect
  useEffect(() => {
    const fetchOwnerAndShopData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch MongoDB userId from Firebase uid
        const userResponse = await fetch(`${BASE_URL}/api/getuserid/${userId}`);
        const userData = await userResponse.json();

        if (!userResponse.ok || !userData.success) {
          throw new Error(userData.error || "Failed to fetch user data");
        }

        // Get the MongoDB userId from the response
        const fetchedOwnerId = userData.userId; // This is the MongoDB _id

        if (!fetchedOwnerId) {
          setError("Could not retrieve user ID. Please try logging in again.");
          setLoading(false);
          return;
        }

        setOwnerId(fetchedOwnerId);

        // Step 2: Fetch shop data using ownerId
        const shopResponse = await fetch(
          `${BASE_URL}/api/shops/owner/${fetchedOwnerId}`
        );
        const shopData = await shopResponse.json();

        if (shopResponse.ok && shopData.success && shopData.data) {
          // Shop exists
          const shopDetails = shopData.data;

          // Transform coordinates from the GeoJSON format
          const formattedShop = {
            ...shopDetails,
            latitude: shopDetails.location.coordinates[1],
            longitude: shopDetails.location.coordinates[0],
          };

          setShop(formattedShop);
          form.reset(formattedShop);
        } else {
          // No shop found
          setShop(null);
          setIsCreating(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load shop information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerAndShopData();
  }, [userId, form]);

  // And in your onSubmit function, make sure the shop data includes location formatted correctly:
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure name is not empty
      if (!data.name || data.name.trim() === "") {
        setError("Shop name is required.");
        setLoading(false);
        return;
      }

      const shopData = {
        name: data.name,
        location: {
          type: "Point",
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
        },
        category: data.category,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        isOrganicCertified: data.isOrganicCertified || false,
        isLocalFarm: data.isLocalFarm || false,
        owner: ownerId, // MongoDB ObjectId
      };

      let response;

      if (isCreating) {
        // Create new shop
        response = await fetch(`${BASE_URL}/api/shops`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shopData),
        });
      } else {
        // Update existing shop
        response = await fetch(`${BASE_URL}/api/shops/${shop._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shopData),
        });
      }

      const result = await response.json();

      if (response.ok && result.success) {
        // Update local state with the returned shop data
        const updatedShop = result.data;
        const formattedShop = {
          ...updatedShop,
          latitude: updatedShop.location.coordinates[1],
          longitude: updatedShop.location.coordinates[0],
        };

        setShop(formattedShop);
        setIsEditing(false);
        setIsCreating(false);
      } else {
        setError(result.error || "Failed to save shop information.");
      }
    } catch (err) {
      console.error("Error saving shop data:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    "Groceries",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Beverages",
    "Organic",
    "Other",
  ];

  if (loading && !shop && !isCreating) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p>Loading shop information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  const getLocationWithPermissionCheck = async () => {
    if (!("geolocation" in navigator)) {
      throw new Error("Geolocation is not supported by your browser.");
    }

    let permissionStatus;
    if ("permissions" in navigator) {
      try {
        permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
      } catch (err) {
        permissionStatus = { state: "prompt" };
      }
    } else {
      permissionStatus = { state: "prompt" };
    }

    if (
      permissionStatus.state === "granted" ||
      permissionStatus.state === "prompt"
    ) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        });
      });
    } else {
      throw new Error("Location access denied. Enable it in browser settings.");
    }
  };

  const handleUseLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const position = await getLocationWithPermissionCheck();
      form.setValue("latitude", position.coords.latitude.toFixed(6));
      form.setValue("longitude", position.coords.longitude.toFixed(6));
    } catch (error) {
      setLocationError(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  };
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            {isCreating ? "Create Your Shop" : "Shop Information"}
          </CardTitle>
          {isCreating && (
            <CardDescription>
              Complete the form below to create your shop profile
            </CardDescription>
          )}
        </div>

        {!isCreating && !isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            {!isCreating && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset(shop);
                }}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </Button>
            )}
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing && !isCreating}
                        placeholder="Enter your shop name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing && !isCreating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing && !isCreating}
                        placeholder="e.g. 40.7128"
                        type="number"
                        step="0.000001"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing && !isCreating}
                        placeholder="e.g. -74.0060"
                        type="number"
                        step="0.000001"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={(!isEditing && !isCreating) || isLoadingLocation}
                  variant="outline"
                  className="gap-2"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  Use Current Location
                </Button>
                {locationError && (
                  <p className="text-red-500 text-sm mt-2">{locationError}</p>
                )}
              </div>
              <FormField
                control={form.control}
                name="isOrganicCertified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing && !isCreating}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Organic Certified</FormLabel>
                      {shop && !isCreating && (
                        <div className="flex items-center gap-2 mt-1">
                          {shop.isOrganicCertified ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Certified
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                Not Certified
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isLocalFarm"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isEditing && !isCreating}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Local Farm</FormLabel>
                      {shop && !isCreating && (
                        <div className="flex items-center gap-2 mt-1">
                          {shop.isLocalFarm ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Local Farm
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                Not a Local Farm
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ShopDetails;
