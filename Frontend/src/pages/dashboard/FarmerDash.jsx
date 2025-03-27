"use client";
import FarmerDashCards from "./components/Farmer/FarmerDashCards";
import FarmerDashHeader from "./components/Farmer/FarmerDashHeader";
import TabSection from "./components/Farmer/TabSection";
export default function FarmerDashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6 mt-20">
      <FarmerDashHeader/>
      <FarmerDashCards/>
      <TabSection/>
    </div>
  );
}
<<<<<<< HEAD
=======

// StatCard Component
function StatCard({ title, value, description, icon, trend, trendDirection }) {
  let trendColor = "text-gray-500";
  let trendIcon = null;

  if (trendDirection === "up") {
    trendColor = "text-green-500";
    trendIcon = <TrendingUp className="ml-1 h-3 w-3" />;
  } else if (trendDirection === "down") {
    trendColor = "text-red-500";
    trendIcon = <TrendingUp className="ml-1 h-3 w-3 rotate-180" />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-muted p-2">{icon}</div>
          <div className={`text-sm font-medium flex items-center ${trendColor}`}>
            {trend}
            {trendIcon}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  trend: PropTypes.string.isRequired,
  trendDirection: PropTypes.oneOf(["up", "down", "neutral"]).isRequired,
};

// OrdersDashboard Component
function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Ensure handleRefresh function is defined
  const handleRefresh = () => {
    fetchOrders(); // Call fetchOrders to refresh data
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <CardDescription>Manage and track your customer orders</CardDescription>
          </div>
          {/* Ensure handleRefresh is called properly */}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.crop}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Delivered" ? "success" : order.status === "Processing" ? "warning" : "default"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Clipboard className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">No orders found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// CropsDashboard Component
function CropsDashboard({ crops, setCrops, onEditCrop }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/crops"); // Direct backend URL
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCrops(data); // Update state with fetched data
    } catch (error) {
      setError("Failed to fetch crops: " + error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleRefresh = () => {
    fetchCrops();
  };

  if (error) return <p className="text-red-500">{error}</p>;

  const renderCrops = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            <Loader2 className="animate-spin mx-auto h-6 w-6" />
            <p className="text-sm text-muted-foreground mt-2">Loading crops...</p>
          </TableCell>
        </TableRow>
      );
    }

    if (crops.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8">
            <Plant className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">No crops found.</p>
          </TableCell>
        </TableRow>
      );
    }

    return crops.map((crop) => (
      <TableRow key={crop._id || crop.id}> {/* Use _id from MongoDB */}
        <TableCell className="font-medium">{crop.name}</TableCell>
        <TableCell>{crop.price}</TableCell>
        <TableCell>{crop.stock}</TableCell>
        <TableCell>{crop.season}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEditCrop(crop)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Update stock for crop ${crop._id || crop.id}`)}
            >
              Update Stock
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Crop Inventory</CardTitle>
            <CardDescription>Manage your crop inventory and pricing</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available Stock</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderCrops()}</TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Showing {crops.length} of {crops.length} crops</p>
        <Button variant="outline" size="sm">Add New Crop</Button>
      </CardFooter>
    </Card>
  );
}

CropsDashboard.propTypes = {
  crops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // Allow _id or id
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      stock: PropTypes.string.isRequired,
      season: PropTypes.string.isRequired,
    })
  ).isRequired,
  setCrops: PropTypes.func.isRequired, // Added
  onEditCrop: PropTypes.func.isRequired,
};

// ReviewsDashboard Component
function ReviewsDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Demo data
      setReviews(demoReviews);
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="animate-spin h-6 w-6" />
          <p className="text-sm text-muted-foreground mt-2">Loading reviews...</p>
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Star className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">No reviews available yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-muted">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{review.customer}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={`${review.id}-star-${i}`}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Customer Reviews</CardTitle>
        <CardDescription>See what your customers are saying about your products</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View All Reviews</Button>
      </CardFooter>
    </Card>
  );
}

// StatisticsDashboard Component
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

// CropFormDialog Component
function CropFormDialog({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { name: "", price: "", stock: "", season: "", image: null }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("season", formData.season);
    if (formData.image) formDataObj.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:3000/api/crops", {
        method: "POST",
        body: formDataObj,
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      onSubmit(data); // Update state with the new crop
    } catch (error) {
      console.error("Error submitting crop:", error);
      alert("Failed to add crop. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Crop" : "Add New Crop"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the crop details." : "Add a new crop to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Crop Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="text"
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="season" className="block text-sm font-medium text-gray-700">Season</label>
            <input
              type="text"
              name="season"
              id="season"
              value={formData.season}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        ></path>
                      </svg>
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full">{initialData ? "Update Crop" : "Add Crop"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

CropFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};
>>>>>>> 2fb15a5b4fc584304b28450f6ba25688c48efbb6
