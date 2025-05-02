import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import PropTypes from "prop-types";
import { Plus, X } from "lucide-react";

export const AddProductDialog = ({ open, onOpenChange, onAddProduct, shopId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Other",
    price: 0,
    originalPrice: 0,
    quantity: 0,
    isOrganic: false,
    images: ["https://via.placeholder.com/200x150?text=Product+Image"],
    keyFeatures: [],
  });

  const [currentFeature, setCurrentFeature] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  const categories = [
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = Number(value);
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() && formData.keyFeatures.length < 3) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (currentImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, currentImage.trim()],
      }));
      setCurrentImage("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct({
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hidden">
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Bdt)*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (Bdt)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Key Features (max 3)</Label>
            <div className="flex gap-2">
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                maxLength={100}
                placeholder="Add a key feature"
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                disabled={!currentFeature.trim() || formData.keyFeatures.length >= 3}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keyFeatures.map((feature, index) => (
                <div
                  key={`feature-${feature}-${index}`}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex gap-2">
              <Input
                value={currentImage}
                onChange={(e) => setCurrentImage(e.target.value)}
                placeholder="Enter image URL"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={!currentImage.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {formData.images.map((image, index) => (
                <div key={`image-${image}-${index}`} className="relative group">
                  <img
                    src={image}
                    alt={`Product preview ${index}`}
                    className="h-20 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isOrganic"
              name="isOrganic"
              type="checkbox"
              checked={formData.isOrganic}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <Label htmlFor="isOrganic">Organic Product</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onAddProduct: PropTypes.func.isRequired,
  shopId: PropTypes.string.isRequired,
};

export default AddProductDialog;
