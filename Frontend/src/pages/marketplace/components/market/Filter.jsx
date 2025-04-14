"use client";

import { Filter, X } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const groceryCategories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bakery",
  "Frozen Foods",
  "Pantry Staples",
  "Beverages",
  "Snacks",
];

const deliveryOptions = [
  "Same Day Delivery",
  "Next Day Delivery",
  "Pickup Available",
  "Shipping Available",
];
const getInitialFilters = () => ({
  category: [],
  delivery: [], // Ensure delivery array exists
  rating: "",
  organic: false,
  local: false,
});
  
function Filters({ filters, setFilters }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const handleDeliveryChange = (option) => {
    setFilters((prev) => ({
      ...prev,
      delivery: prev.delivery.includes(option)
        ? prev.delivery.filter((d) => d !== option)
        : [...prev.delivery, option],
    }));
  };

  const clearFilters = () => {
    setFilters(getInitialFilters());
  };
  

  const appliedFiltersCount =
    filters.category.length +
    filters.delivery.length +
    (filters.rating ? 1 : 0) +
    (filters.organic ? 1 : 0) +
    (filters.local ? 1 : 0);

  return (
    <div>
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex gap-2 relative sm:h-full sm:w-full h-9 w-9">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {appliedFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {appliedFiltersCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Filters</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Categories Filter */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {groceryCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={filters.category.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label
                      htmlFor={`cat-${category}`}
                      className="text-sm font-normal"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Options */}
            <div>
              <h3 className="font-medium mb-3">Delivery Options</h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`del-${option}`}
                      checked={filters.delivery.includes(option)}
                      onCheckedChange={() => handleDeliveryChange(option)}
                    />
                    <Label
                      htmlFor={`del-${option}`}
                      className="text-sm font-normal"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-medium mb-3">Minimum Rating</h3>
              <Select
                value={filters.rating}
                onValueChange={(value) =>
                  setFilters({ ...filters, rating: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Other Filters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="organic"
                  checked={filters.organic}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, organic: checked })
                  }
                />
                <Label htmlFor="organic" className="text-sm font-normal">
                  Organic Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="local"
                  checked={filters.local}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, local: checked })
                  }
                />
                <Label htmlFor="local" className="text-sm font-normal">
                  Local Shops Only
                </Label>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-foreground bg-secondary"
          >
            Clear all
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AppliedFilters({ filters, setFilters }) {
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.filter((c) => c !== category),
    }));
  };

  const handleDeliveryChange = (option) => {
    setFilters((prev) => ({
      ...prev,
      delivery: prev.delivery.filter((d) => d !== option),
    }));
  };

  const clearFilters = () => {
    setFilters(getInitialFilters());
  };
  

  const appliedFiltersCount =
    filters.category.length +
    filters.delivery.length +
    (filters.rating ? 1 : 0) +
    (filters.organic ? 1 : 0) +
    (filters.local ? 1 : 0);

  if (appliedFiltersCount === 0) return null;

  return (
    <div className="container py-2 border-b">
      <div className="flex flex-wrap gap-2">
        {filters.category.map((category) => (
          <div
            key={category}
            className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
          >
            {category}
            <Button
              onClick={() => handleCategoryChange(category)}
              className="ml-2 bg-transparent h-4 w-4 text-muted-foreground hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {filters.delivery.map((option) => (
          <div
            key={option}
            className="flex items-center bg-muted px-3 py-1 rounded-full text-sm"
          >
            {option}
            <Button
              onClick={() => handleDeliveryChange(option)}
              className="ml-2 bg-transparent h-4 w-4 text-muted-foreground hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {filters.rating && (
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            {filters.rating}+ Stars
            <Button
              onClick={() => setFilters({ ...filters, rating: "" })}
              className="ml-2 bg-transparent h-4 w-4 text-muted-foreground hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        {filters.organic && (
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            Organic
            <Button
              onClick={() => setFilters({ ...filters, organic: false })}
              className="ml-2 bg-transparent h-4 w-4 text-muted-foreground hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        {filters.local && (
          <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
            Local
            <Button
              onClick={() => setFilters({ ...filters, local: false })}
              className="ml-2 bg-transparent h-4 w-4 text-muted-foreground hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <Button
          onClick={clearFilters}
          className="text-foreground text-sm flex items-center ml-2 bg-primary"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
}

// Prop validation
Filters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    delivery: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.string,
    organic: PropTypes.bool.isRequired,
    local: PropTypes.bool.isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

AppliedFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    delivery: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.string,
    organic: PropTypes.bool.isRequired,
    local: PropTypes.bool.isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export { Filters, AppliedFilters, getInitialFilters  };
export default Filters;
