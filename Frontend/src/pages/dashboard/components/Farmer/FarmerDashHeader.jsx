import { useState } from "react"; // Removed unnecessary React import
import { Calendar, TreesIcon as Plant } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../../components/ui/dialog";

function FarmerDashHeader({ crops, setCrops }) { // Added crops and setCrops as props
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const handleAddOrUpdateCrop = (cropData) => {
    if (selectedCrop) {
      // Update existing crop (not implemented in this example)
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === selectedCrop.id ? { ...crop, ...cropData } : crop
        )
      );
    } else {
      // Add new crop
      setCrops((prevCrops) => [...prevCrops, cropData]);
    }
    setSelectedCrop(null);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-secondary" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            March 25, 2025
          </Button>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plant className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </div>
      </header>
      <CropFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCrop(null);
        }}
        onSubmit={handleAddOrUpdateCrop}
        initialData={selectedCrop}
      />
    </div>
  );
}

export default FarmerDashHeader;

// CropFormDialog Component
function CropFormDialog({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      category: "", // Changed from season to match backend schema
      price: "",
      stock: "",
      supplier: "",
      harvestDate: "",
      expirationDate: "",
      image: null,
    }
  );
  const [error, setError] = useState(""); // Added error state for feedback

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
    formDataObj.append("category", formData.category); // Align with backend
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("supplier", formData.supplier);
    formDataObj.append("harvestDate", formData.harvestDate);
    formDataObj.append("expirationDate", formData.expirationDate);
    if (formData.image) formDataObj.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:3000/api/crops", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Ensure the returned data matches the expected structure
      const newCrop = {
        id: data._id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
        supplier: data.supplier,
        harvestDate: data.harvestDate,
        expirationDate: data.expirationDate,
        image: data.image,
      };
      onSubmit(newCrop); // Pass the formatted crop data to parent
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error submitting crop:", error.message);
      setError("Failed to add crop: " + error.message); // Display specific error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Crop" : "Add New Crop"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the crop details."
              : "Add a new crop to your inventory."}
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Crop Name
            </label>
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number" // Changed to number for better validation
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
              step="0.01" // Allow decimals
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock (kg)
            </label>
            <input
              type="number" // Changed to number
              name="stock"
              id="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              id="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">
              Harvest Date
            </label>
            <input
              type="date"
              name="harvestDate"
              id="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
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
            <Button type="submit" className="w-full">
              {initialData ? "Update Crop" : "Add Crop"}
            </Button>
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

// Update FarmerDashHeader PropTypes
FarmerDashHeader.propTypes = {
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
};

