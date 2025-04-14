import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

function FarmerMarket() {
  // Sample data
  const farmersWithProducts = [
    {
      id: 1,
      name: "Green Valley Farms",
      location: "Springfield, CA",
      description: "Organic produce since 1985",
      products: [
        { id: 101, name: "Organic Apples", price: 2.99, unit: "lb", organic: true },
        { id: 102, name: "Carrots", price: 1.49, unit: "bunch", organic: true },
        { id: 103, name: "Free-range Eggs", price: 4.99, unit: "dozen", organic: false }
      ]
    },
    {
      id: 2,
      name: "Sunny Acres",
      location: "Riverside, TX",
      description: "Grass-fed meats and honey",
      products: [
        { id: 201, name: "Grass-fed Beef", price: 8.99, unit: "lb", organic: false },
        { id: 202, name: "Raw Honey", price: 7.50, unit: "jar", organic: true }
      ]
    },
    {
      id: 3,
      name: "Blue Hill Dairy",
      location: "Great Falls, MT",
      description: "Artisanal dairy products",
      products: [
        { id: 301, name: "Whole Milk", price: 3.25, unit: "gallon", organic: true },
        { id: 302, name: "Cheddar Cheese", price: 5.75, unit: "lb", organic: true },
        { id: 303, name: "Yogurt", price: 2.99, unit: "quart", organic: false }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background image with overlay */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
          alt="Farm background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Local Farmers Market</h1>
          <p className="text-white/80 mt-3 text-lg">
            Discover fresh products directly from local farmers
          </p>
        </div>
        
        <div className="space-y-8">
          {farmersWithProducts.map(farmer => (
            <Card key={farmer.id} className="overflow-hidden border-none shadow-xl">
              {/* Farmer header with frosted glass effect */}
              <CardHeader className="p-0 h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-end p-6">
                  <div className="w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <CardTitle className="text-3xl text-white">{farmer.name}</CardTitle>
                        <CardDescription className="text-white/80 text-lg">
                          {farmer.location} • {farmer.description}
                        </CardDescription>
                      </div>
                      <Button variant="secondary" size="lg">
                        View Farm
                      </Button>
                    </div>
                  </div>
                </div>
                <img 
                  src={`https://source.unsplash.com/random/1600x900/?farm,${farmer.id}`}
                  alt={farmer.name}
                  className="w-full h-full object-cover absolute -z-10"
                />
              </CardHeader>
              
              {/* Products section */}
              <CardContent className="p-8 bg-white/90 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmer.products.map(product => (
                    <Card key={product.id} className="hover:shadow-lg transition-all duration-300 h-full">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{product.name}</CardTitle>
                          {product.organic && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Organic
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-3xl font-bold text-primary">
                              ${product.price}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              per {product.unit}
                            </p>
                          </div>
                          <Button size="default" className="shrink-0">
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FarmerMarket;