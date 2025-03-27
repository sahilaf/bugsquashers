import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, TreesIcon as Plant } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";


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
        <TableCell>{crop.price}</TableCell><TableCell>{crop.stock}</TableCell><TableCell>{crop.season}</TableCell><TableCell>
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
            <TableRow><TableHead>Crop</TableHead><TableHead>Price</TableHead><TableHead>Available Stock</TableHead><TableHead>Season</TableHead><TableHead>Action</TableHead>
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


export default CropsDashboard;