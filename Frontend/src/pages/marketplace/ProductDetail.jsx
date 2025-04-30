import { ProductGallery } from "./components/product/ProductGallery";
import { ProductInfo } from "./components/product/ProductInfo";
import { ProductReviews } from "./components/product/ProductReviews";
import { SuggestedProducts } from "./components/product/SuggestedProducts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const reviews = [
    {
      id: 1,
      author: "John Doe",
      authorInitials: "JD",
      date: "March 2, 2024",
      rating: 5,
      title: "Delicious and fresh!",
      content:
        "These apples are amazing! So crisp and juicy. I've been buying them weekly for my family and they're always perfect. Highly recommend for anyone looking for quality organic produce.",
      helpfulCount: 12,
    },
    {
      id: 2,
      author: "Sarah Miller",
      authorInitials: "SM",
      date: "February 15, 2024",
      rating: 4,
      title: "Great quality, but a bit pricey",
      content:
        "The apples are definitely high quality and taste great. My only complaint is that they're a bit more expensive than other organic options at my local market. Still, the convenience of delivery makes up for it.",
      helpfulCount: 8,
    },
  ];

  const suggestedProducts = [
    {
      id: 1,
      name: "Organic Oranges",
      price: "4.00",
      image: "https://placehold.co/300x300?text=Oranges",
      rating: 4,
      badge: "New",
    },
    {
      id: 2,
      name: "Organic Bananas",
      price: "2.50",
      image: "https://placehold.co/300x300?text=Bananas",
      rating: 5,
    },
    {
      id: 3,
      name: "Organic Strawberries",
      price: "5.99",
      salePrice: "3.99",
      image: "https://placehold.co/300x300?text=Strawberries",
      rating: 4,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Organic Blueberries",
      price: "4.50",
      image: "https://placehold.co/300x300?text=Blueberries",
      rating: 5,
    },
  ];

  const handleAddToCart = (quantity, variant) => {
    alert(`Added ${quantity} ${variant} apple(s) to cart`);
  };

  const handleBuyNow = (quantity, variant) => {
    alert(`Proceeding to checkout with ${quantity} ${variant} apple(s)`);
  };

  const handleWriteReview = () => {
    alert("Opening review form");
  };
  if (loading) {
    return <div className="container mx-auto px-4 py-8 mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-10">Error: {error}</div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-10">Product not found</div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm mb-4">
        <a href="/" className="hover:underline">
          Shop all
        </a>
        <span>-</span>
        <a href="/" className="hover:underline">
          {product.category}
        </a>
        <span>-</span>
        <span>{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery product={product} />
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      
      <ProductReviews reviews={reviews} onWriteReview={handleWriteReview} />
      <SuggestedProducts products={suggestedProducts} />
    </div>
  );
};
