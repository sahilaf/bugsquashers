import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";

function CropsDashboard({ crops, setCrops, onViewAll }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Renamed for clarity
  const [currentCrop, setCurrentCrop] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    supplier: "",
    harvestDate: "",
    expirationDate: "",
  });
  

  // Filter crops based on search and filters
  const applyFilters = () => {
    let updatedCrops = crops.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categoryFilter && categoryFilter !== "all") {
      updatedCrops = updatedCrops.filter((crop) => crop.category === categoryFilter);
    }

    if (stockFilter === "low") {
      updatedCrops = updatedCrops.filter((crop) => crop.stock < 20);
    } else if (stockFilter === "high") {
      updatedCrops = updatedCrops.filter((crop) => crop.stock >= 100);
    }

    return updatedCrops;
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  useEffect(() => {
    setFilteredCrops(applyFilters());
  }, [searchQuery, categoryFilter, stockFilter, crops]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/crops`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCrops(validateCropData(data));
    } catch (error) {
      setError("Failed to fetch crops: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateCropData = (data) => {
    return data.map((crop) => ({
      id: crop._id || Date.now(),
      name: crop.name || "Unnamed Crop",
      category: crop.category || "Uncategorized",
      price: Number(crop.price) || 0,
      stock: Number(crop.stock) || 0,
      supplier: crop.supplier || "Unknown",
      harvestDate: crop.harvestDate || "N/A",
      expirationDate: crop.expirationDate || "N/A",
      image: crop.image || null,
    }));
  };

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteCrop = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/crops/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete crop");
        setCrops((prevCrops) => prevCrops.filter((crop) => crop.id !== id));
      } catch (error) {
        setError("Error deleting crop: " + error.message);
      }
    }
  };

  const handleEditClick = (crop) => {
    setCurrentCrop(crop);
    setEditForm({
      name: crop.name,
      category: crop.category,
      price: crop.price,
      stock: crop.stock,
      supplier: crop.supplier,
      harvestDate: crop.harvestDate,
      expirationDate: crop.expirationDate,
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/crops/${currentCrop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to update crop");
      const updatedCrop = await response.json();
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === currentCrop.id ? validateCropData([updatedCrop])[0] : crop
        )
      );
      setIsEditDialogOpen(false);
    } catch (error) {
      setError("Error updating crop: " + error.message);
    }
  };

  

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline h-4 w-4" />
    ) : (
      <ChevronDown className="inline h-4 w-4" />
    );
  };

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Crop Inventory</CardTitle>
              <CardDescription>Manage your crops efficiently</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchCrops} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Grains">Grains</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="low">Low Stock (≤20kg)</SelectItem>
                <SelectItem value="high">High Stock (≥100kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                  Crop {getSortIndicator("name")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("category")}>
                  Category {getSortIndicator("category")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("price")}>
                  Price {getSortIndicator("price")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("stock")}>
                  Stock {getSortIndicator("stock")}
                </TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCrops.length > 0 ? (
                sortedCrops.map((crop) => (
                  <TableRow key={crop.id}>
                    <TableCell>{crop.name}</TableCell>
                    <TableCell>{crop.category}</TableCell>
                    <TableCell>${crop.price.toFixed(2)}/kg</TableCell>
                    <TableCell>{crop.stock} kg</TableCell>
                    <TableCell>{crop.supplier}</TableCell>
                    <TableCell>{crop.harvestDate}</TableCell>
                    <TableCell>{crop.expirationDate}</TableCell>
                    <TableCell>
                      {crop.image ? (
                        <img
                          src={`${BASE_URL}${crop.image}`}
                          alt={crop.name}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        "No Image"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(crop)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCrop(crop.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    {loading ? "Loading crops..." : "No crops found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={onViewAll}>
            View All Crops
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
            <DialogDescription>
              Make changes to the crop details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {renderFormField("name", "Name", "text", editForm, setEditForm)}
            {renderCategorySelect(editForm, setEditForm)}
            {renderFormField("price", "Price", "number", editForm, setEditForm)}
            {renderFormField("stock", "Stock (kg)", "number", editForm, setEditForm)}
            {renderFormField("supplier", "Supplier", "text", editForm, setEditForm)}
            {renderFormField("harvestDate", "Harvest Date", "date", editForm, setEditForm)}
            {renderFormField("expirationDate", "Expiration Date", "date", editForm, setEditForm)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );

  function renderFormField(name, label, type, form, setForm) {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={name} className="text-right">
          {label}
        </Label>
        <Input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={(e) => handleFormChange(e, setForm)}
          className="col-span-3"
        />
      </div>
    );
  }

  function renderCategorySelect(form, setForm) {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Select
          name="category"
          value={form.category}
          onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Grains">Grains</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
}

CropsDashboard.propTypes = {
  crops: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      supplier: PropTypes.string,
      harvestDate: PropTypes.string,
      expirationDate: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
  setCrops: PropTypes.func.isRequired,
  onViewAll: PropTypes.func.isRequired,
};

export default CropsDashboard;