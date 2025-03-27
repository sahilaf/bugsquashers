import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Loader2, Star } from "lucide-react";

const demoReviews = [
    { id: "1", customer: "John Doe", rating: 5, comment: "Excellent quality produce!", date: "2025-02-28" },
    { id: "2", customer: "Jane Smith", rating: 4, comment: "Fresh and tasty vegetables.", date: "2025-03-01" },
    { id: "3", customer: "Robert Johnson", rating: 5, comment: "Best organic farm in the region!", date: "2025-03-05" },
  ];

// ReviewsDashboard Component
function ReviewsDashboard() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchReviews = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Demo data
        setReviews(demoReviews);
        setLoading(false);
      };
      fetchReviews();
    }, []);
  
    const renderContent = () => {
      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6" />
            <p className="text-sm text-muted-foreground mt-2">Loading reviews...</p>
          </div>
        );
      }
  
      if (reviews.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Star className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">No reviews available yet.</p>
          </div>
        );
      }
  
      return (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="border border-muted">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{review.customer}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`${review.id}-star-${i}`}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Customer Reviews</CardTitle>
          <CardDescription>See what your customers are saying about your products</CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">View All Reviews</Button>
        </CardFooter>
      </Card>
    );
  }

export default ReviewsDashboard;