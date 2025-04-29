import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../pages/cart/context/CartContex";
import Orb from "../../components/Orb";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
export default function Recommendation() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetUsed, setBudgetUsed] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setProducts([]);
    setRecommendations("");
    setLoading(true);

    try {
      // 1) Call recommendation endpoint
      const recRes = await fetch("http://127.0.0.1:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, budget: parseFloat(budget) }),
      });
      const recData = await recRes.json();
      if (!recRes.ok) throw new Error(recData.error || "Recommendation failed");

      setBudgetUsed(recData.budget_used);
      setRecommendations(recData.recommendations);

      // 2) Deduplicate source IDs
      const uniqueIds = Array.from(
        new Set(recData.sources.map((src) => src.id))
      );

      // 3) Fetch full product details for each unique ID
      const productFetches = uniqueIds.map((id) =>
        fetch(`http://localhost:3000/api/products/${id}`).then((res) => {
          if (!res.ok) throw new Error(`Product ${id} not found`);
          return res.json();
        })
      );
      const prods = await Promise.all(productFetches);
      setProducts(prods);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full min-h-screen w-full bg-background pt-16 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-start justify-between gap-4 md:gap-8">
        {/* Left Side - Card (now full width on mobile, fixed width on desktop) */}
        <div className="w-full lg:w-[1000px] pt-4 lg:pt-20 order-2 lg:order-1">
          <Card className="lg:col-span-2">
            
            <CardHeader>
            <CardTitle className="text-3xl font-bold mb-4 font-mono">FAIRBASKET AI</CardTitle>
              <h1 className="text-lg font-semibold mb-2">
                Finds the best product for your budget
              </h1>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              >
                <div className="flex flex-col sm:col-span-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="query">Prompt</Label>
                    <Input
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. organic fruits"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 40"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Searching…" : "Find Recommendations"}
                  </Button>
                </div>
              </form>

              {error && <p className="text-sm text-red-600 mb-4">⚠️ {error}</p>}

              {recommendations && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">
                    Budget Used: {budgetUsed}
                  </h3>
                  <pre className="whitespace-pre-wrap mt-2">
                    {recommendations}
                  </pre>
                </div>
              )}

              {products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <Card
                      key={product._id}
                      className="relative h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden"
                    >
                      <img
                        src={
                          product.images?.[0] ||
                          product.image ||
                          "https://via.placeholder.com/200x150?text=Product+Image"
                        }
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/70 backdrop-blur-md border-t border-t-[#ffffff33]">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-white drop-shadow">
                            ${product.price.toFixed(2)}
                            {product.originalPrice > 0 && (
                              <span className="ml-1 text-xs line-through text-white">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </p>
                          {product.isOrganic && (
                            <Badge className="bg-green-500/90 text-white text-[10px]">
                              Organic
                            </Badge>
                          )}
                        </div>
                        <div className="p-2 space-y-2 flex-1 flex flex-col">
                          <div className="space-y-1">
                            <h3 className="line-clamp-2 text-sm font-bold text-white">
                              {product.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-2 mt-auto">
                            <span className="text-xs text-white">
                              Sold {product.soldCount || 0}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 md:h-10 md:w-10 rounded-full text-white"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(product._id);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                              <span className="sr-only">Add to cart</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Orb (hidden on mobile, smaller on tablet) */}
        <motion.div className="flex flex-col items-center justify-center w-full lg:w-[800px] h-[400px] md:h-[500px] lg:h-[800px] -mt-0 md:-mt-32 order-1 lg:order-2 lg:pl-20"
        
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          
        >
          {/* Orb component in the background */}
          <Orb className="relative inset-0 " />
          {/* Text inside Orb */}
          <div className="absolute z-10  font-bold text-base sm:text-lg lg:text-2xl text-start px-4 w-[300px] md:w-[350px] font-mono">
          <span className="dark:bg-gradient-to-r dark:from-green-400 dark:to-white bg-clip-text text-transparent bg-gradient-to-r from-green-950 to-green-400">
            Prompt: "
            <Typewriter
              words={[
                "Need fresh vegetables!",
                "I'm making pasta suggest me items I need.",
                "Fresh juice for breakfast.",
                "Monthly groceries.",
              ]}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              loop={true}
              deleteSpeed={50}
              delaySpeed={1000}
            />
            "
          </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
