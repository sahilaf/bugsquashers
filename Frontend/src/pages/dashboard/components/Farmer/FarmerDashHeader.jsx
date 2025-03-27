import { useState, React } from "react";
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

function FarmerDashHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [crops, setCrops] = useState([]); // Moved crops state here for simplicity
  const handleAddOrUpdateCrop = (cropData) => {
    if (selectedCrop) {
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === selectedCrop.id ? { ...crop, ...cropData } : crop
        )
      );
    } else {
      setCrops((prevCrops) => [
        ...prevCrops,
        { id: (prevCrops.length + 1).toString(), ...cropData },
      ]);
    }
    setSelectedCrop(null);
    setIsDialogOpen(false);
  };
  
  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Farmer Dashboard
          </h1>
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
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
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
          <DialogTitle>
            {initialData ? "Edit Crop" : "Add New Crop"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the crop details."
              : "Add a new crop to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
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
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
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
            <label
              htmlFor="season"
              className="block text-sm font-medium text-gray-700"
            >
              Season
            </label>
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
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or JPEG (MAX. 5MB)
                      </p>
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
