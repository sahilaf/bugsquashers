import PropTypes from "prop-types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Package, CreditCard, MapPin, User } from "lucide-react";
import RecentOrders from "./components/Customer/RecentOrder";
import { SavedAddresses } from "./components/Customer/SavedAddresses";
import { useAuth } from "../../pages/auth/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
const DashboardCard = ({ title, value, description, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

const AccountOverview = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { userId: uid } = useAuth();
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user data based on Firebase UID
  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
        
        // Updated to match the new endpoint pattern
        const response = await fetch(`${BASE_URL}/api/getuser/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Removed Authorization header since we're not verifying tokens
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const data = await response.json();
        setUserData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [uid]);
  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await axios.put(
        `${BASE_URL}/api/updateuser/${uid}`, // Updated to include UID in URL for consistency
        {
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
        }
      );
      alert('Account updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Update your account details here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={'/placeholder.svg'}
            />
            <AvatarFallback>
              {userData.fullName ? userData.fullName[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{userData.fullName}</h3>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Name</Label>
          <Input
            id="fullName"
            value={userData.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Account'}
        </Button>
      </CardContent>
    </Card>
  );
};

const CustomerDashboard = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-4 space-y-6 pt-20">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>

        {/* Responsive Grid for Dashboard Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Orders"
            value="23"
            description="Lifetime orders"
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Total Spent"
            value="$1,234"
            description="Lifetime spend"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Saved Addresses"
            value="3"
            description="Delivery locations"
            icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          />
          <DashboardCard
            title="Account Age"
            value="2 years"
            description="Member since 2021"
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Responsive Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          {/* TabsList with Horizontal Scroll on Mobile */}
          <TabsList className="w-full flex overflow-x-auto sm:overflow-visible">
            <TabsTrigger value="overview" className="flex-shrink-0">
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex-shrink-0">
              Orders
            </TabsTrigger>
            <TabsTrigger value="account" className="flex-shrink-0">
              Account
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex-shrink-0">
              Addresses
            </TabsTrigger>
          </TabsList>

          {/* TabsContent */}
          <TabsContent value="overview" className="space-y-4">
            <RecentOrders />
            <AccountOverview />
          </TabsContent>
          <TabsContent value="orders">
            <RecentOrders fullList={true} />
          </TabsContent>
          <TabsContent value="account">
            <AccountOverview />
          </TabsContent>
          <TabsContent value="addresses">
            <SavedAddresses />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
