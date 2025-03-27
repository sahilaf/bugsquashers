import { Star } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../components/ui/progress";
import { ProductReviewItem } from "./ProductReviewItem";
import PropTypes from "prop-types";
export const ProductReviews = ({ reviews, onWriteReview }) => {
  const stars = Array.from({ length: 5 }, (_, i) => ({ id: `star-${i}` }));
  const ratingData = [
    { rating: 5, value: 75, percentage: "75%" },
    { rating: 4, value: 15, percentage: "15%" },
    { rating: 3, value: 5, percentage: "5%" },
    { rating: 2, value: 3, percentage: "3%" },
    { rating: 1, value: 2, percentage: "2%" },
  ];

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Review Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold">4.5</div>
            <div className="flex flex-col">
              <div className="flex">
                {stars.map((star, index) => (
                  <Star
                    key={star.id}
                    className={`h-5 w-5 ${
                      index < 4
                        ? "fill-primary text-primary"
                        : "fill-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Based on 20 reviews
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {ratingData.map(({ rating, value, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="text-sm w-8">{rating} ★</div>
                <Progress value={value} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {percentage}
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={onWriteReview}>
            Write a Review
          </Button>
        </div>

        {/* Review List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.map((review) => (
            <ProductReviewItem key={review.id} review={review} />
          ))}

          <Button
            variant="outline"
            className="w-full bg-primary"
            onClick={() => alert("Loading more reviews")}
          >
            Load More Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};

ProductReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  onWriteReview: PropTypes.func.isRequired,
};