"use client"

import { useState } from "react"
import { Search, ShoppingCart, Filter, ChevronDown, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Slider } from "../../components/ui/slider"
import { Checkbox } from "../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../../components/ui/sheet"

function App() {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background mt-20 lg:mx-32">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center justify-between h-16 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="outline" size="icon" className="shrink-0 md:hidden" onClick={() => setFilterOpen(true)}>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" className="text-sm">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="ghost" className="text-sm hidden lg:flex">
                Ready to ship
              </Button>
              <Button variant="ghost" className="text-sm hidden lg:flex">
                Organic
              </Button>
              <Button variant="ghost" className="text-sm hidden xl:flex">
                Local Farms
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
          <SheetHeader className="mb-5">
            <SheetTitle className="flex justify-between items-center">
              Filters
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>

          {/* Filter Content - Same as sidebar */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                Clear All
              </Button>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="font-medium mb-3">Supplier Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified-mobile" />
                    <Label htmlFor="verified-mobile">Verified Suppliers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="organic-certified-mobile" />
                    <Label htmlFor="organic-certified-mobile">Organic Certified</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Product Types</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ready-to-ship-mobile" />
                    <Label htmlFor="ready-to-ship-mobile">Ready to Ship</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="local-produce-mobile" />
                    <Label htmlFor="local-produce-mobile">Local Produce</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Condition</h3>
                <RadioGroup defaultValue="fresh">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fresh" id="fresh-mobile" />
                    <Label htmlFor="fresh-mobile">Fresh</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frozen" id="frozen-mobile" />
                    <Label htmlFor="frozen-mobile">Frozen</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="canned" id="canned-mobile" />
                    <Label htmlFor="canned-mobile">Canned/Preserved</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium mb-3">Min Order</h3>
                <div className="space-y-4">
                  <Slider defaultValue={[10]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="under-10-mobile" />
                    <Label htmlFor="under-10-mobile">Under $10</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="10-25-mobile" />
                    <Label htmlFor="10-25-mobile">$10 - $25</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="25-50-mobile" />
                    <Label htmlFor="25-50-mobile">$25 - $50</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="over-50-mobile" />
                    <Label htmlFor="over-50-mobile">Over $50</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="container py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop Only */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filter</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Supplier Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified">Verified Suppliers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="organic-certified" />
                      <Label htmlFor="organic-certified">Organic Certified</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Product Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ready-to-ship" />
                      <Label htmlFor="ready-to-ship">Ready to Ship</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="local-produce" />
                      <Label htmlFor="local-produce">Local Produce</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Condition</h3>
                  <RadioGroup defaultValue="fresh">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fresh" id="fresh" />
                      <Label htmlFor="fresh">Fresh</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="frozen" id="frozen" />
                      <Label htmlFor="frozen">Frozen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="canned" id="canned" />
                      <Label htmlFor="canned">Canned/Preserved</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Min Order</h3>
                  <div className="space-y-4">
                    <Slider defaultValue={[10]} max={100} step={1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Price</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="under-10" />
                      <Label htmlFor="under-10">Under $10</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="10-25" />
                      <Label htmlFor="10-25">$10 - $25</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="25-50" />
                      <Label htmlFor="25-50">$25 - $50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="over-50" />
                      <Label htmlFor="over-50">Over $50</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  1 - 16 over 7,000 results for <span className="text-primary font-medium">"Fruits"</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Sort by:</span>
                <Select defaultValue="best-match">
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Best Match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-match">Best Match</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Product 1 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Organic+Apples"
                    alt="Organic Apples"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Organic</Badge>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $4.99 <span className="line-through text-muted-foreground text-xs sm:text-sm">$6.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Organic Apples (5 lb)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Freshly Picked, Local Farm</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 120</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Fresh+Bananas"
                    alt="Fresh Bananas"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $2.49 <span className="line-through text-muted-foreground text-xs sm:text-sm">$3.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Fresh Bananas (Bunch)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Imported, Premium Quality</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 250</span>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Organic+Strawberries"
                    alt="Organic Strawberries"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Organic</Badge>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $5.75 <span className="line-through text-muted-foreground text-xs sm:text-sm">$7.50</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Organic Strawberries (16 oz)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Local Farm, Seasonal</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 85</span>
                  </div>
                </div>
              </div>

              {/* Product 4 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Fresh+Avocados"
                    alt="Fresh Avocados"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $6.99 <span className="line-through text-muted-foreground text-xs sm:text-sm">$8.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Fresh Avocados (4 count)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Ready to Eat, Premium</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 180</span>
                  </div>
                </div>
              </div>

              {/* Product 5 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Organic+Carrots"
                    alt="Organic Carrots"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Organic</Badge>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $3.49 <span className="line-through text-muted-foreground text-xs sm:text-sm">$4.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Organic Carrots (2 lb)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Farm Fresh, Local</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 95</span>
                  </div>
                </div>
              </div>

              {/* Product 6 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Fresh+Broccoli"
                    alt="Fresh Broccoli"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $2.99 <span className="line-through text-muted-foreground text-xs sm:text-sm">$3.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Fresh Broccoli (1 lb)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Farm Fresh, Seasonal</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 75</span>
                  </div>
                </div>
              </div>

              {/* Product 7 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Organic+Milk"
                    alt="Organic Milk"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">Organic</Badge>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $4.50 <span className="line-through text-muted-foreground text-xs sm:text-sm">$5.99</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Organic Milk (1 gallon)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Grass-Fed, Local Dairy</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 210</span>
                  </div>
                </div>
              </div>

              {/* Product 8 */}
              <div className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="relative aspect-square">
                  <img
                    src="https://placehold.co/300x300?text=Free-Range+Eggs"
                    alt="Free-Range Eggs"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        $5.25 <span className="line-through text-muted-foreground text-xs sm:text-sm">$6.50</span>
                      </p>
                      <h3 className="font-medium mt-1 text-sm sm:text-base">Free-Range Eggs (12 count)</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Local Farm, Cage-Free</p>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">Sold 150</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 flex justify-center">
              <nav className="flex items-center gap-1">
                <Button variant="outline" size="icon" disabled className="h-8 w-8 sm:h-9 sm:w-9">
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary text-primary-foreground h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  3
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden xs:inline-flex">
                  4
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0 hidden xs:inline-flex">
                  5
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                  <span className="sr-only">Next</span>
                </Button>
              </nav>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Button - Fixed at bottom */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Button onClick={() => setFilterOpen(true)} className="rounded-full h-12 w-12 shadow-lg">
          <Filter className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default App

