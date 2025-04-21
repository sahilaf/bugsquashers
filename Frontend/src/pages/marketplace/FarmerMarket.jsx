import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import axios from 'axios';

function FarmerMarket() {
  const [crops, setCrops] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = "1234567890abcdef12345678"; // Hardcoded for demo; replace with auth

  // Fetch crops and cart from backend
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/crops');
        // Group crops by supplier (assuming supplier is the "farmer")
        const groupedCrops = response.data.reduce((acc, crop) => {
          const supplier = crop.supplier || 'Unknown Farm';
          if (!acc[supplier]) {
            acc[supplier] = {
              id: crop._id,
              name: supplier,
              location: 'Unknown Location', // Add real location if available
              description: 'Fresh produce', // Add real description if available
              products: [],
            };
          }
          acc[supplier].products.push({
            id: crop._id,
            name: crop.name,
            price: crop.price,
            unit: 'unit', // Adjust based on backend data
            organic: true, // Adjust based on backend data
          });
          return acc;
        }, {});
        setCrops(Object.values(groupedCrops));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch crops');
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
        console.log('Fetched cart data:', response.data); // Debug cart data
        setCart(response.data.items || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err.message);
      }
    };

    fetchCrops();
    fetchCart();
  }, []);

  // Add to cart
  const addToCart = async (cropId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/cart', {
        userId,
        cropId,
        quantity: 1,
      });
      setCart(response.data.items);
    } catch (err) {
      console.error('Failed to add to cart:', err.message);
    }
  };

  // Remove from cart
  const removeFromCart = async (cropId) => {
    if (!cropId) {
      console.error('Attempted to remove undefined cropId from cart');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/cart/${userId}/item/${cropId}`);
      setCart(cart.filter(item => item.cropId._id !== cropId && item.cropId !== cropId));
    } catch (err) {
      console.error('Failed to remove from cart:', err.message);
    }
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

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

        {/* Cart Section */}
        <div className="mb-8 bg-orange/90 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cart.map((item, index) => (
                <li key={item.cropId._id || item.cropId || index} className="flex justify-between items-center mb-2">
                  <span>
                    {(item.cropId?.name || 'Unknown Item')} - ${item.cropId?.price || 'N/A'} x {item.quantity}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.cropId._id || item.cropId)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Farmers and Products */}
        <div className="space-y-8">
          {crops.map(farmer => (
            <Card key={farmer.id} className="overflow-hidden border-none shadow-xl">
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
                          <Button
                            size="default"
                            className="shrink-0"
                            onClick={() => addToCart(product.id)}
                          >
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