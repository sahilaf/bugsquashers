import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../pages/cart/context/CartContex";

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
      const uniqueIds = Array.from(new Set(recData.sources.map(src => src.id)));

      // 3) Fetch full product details for each unique ID
      const productFetches = uniqueIds.map(id =>
        fetch(`http://localhost:3000/api/products/${id}`)
          .then(res => {
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
    <div className="h-screen w-full bg-background pt-40 ">
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <Label htmlFor="query">What are you looking for?</Label>
            <Input
              id="query"
              value={query}
              onChange={e => setQuery(e.target.value)}
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
              onChange={e => setBudget(e.target.value)}
              placeholder="e.g. 40"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Find Recommendations"}
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-red-600 mb-4">⚠️ {error}</p>}

        {recommendations && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Budget Used: {budgetUsed}</h3>
            <pre className="whitespace-pre-wrap mt-2">{recommendations}</pre>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product._id} className="relative h-64 sm:h-80 rounded-lg">
                <img
                  src={
                    product.images?.[0] ||
                    product.image ||
                    "https://via.placeholder.com/200x150?text=Product+Image"
                  }
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-background backdrop-blur-sm border-t border-t-[#ffffff33]">
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
                        className="h-10 w-10 rounded-full text-white"
                        onClick={e => {
                          e.preventDefault();
                          addToCart(product._id);
                        }}
                      >
                        <ShoppingCart className="h-5 w-5" />
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
  );
}
