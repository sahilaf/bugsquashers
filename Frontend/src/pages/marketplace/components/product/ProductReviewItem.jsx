import PropTypes from "prop-types";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";

export const ProductReviewItem = ({ review }) => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-primary text-primary"
            : "fill-muted stroke-muted-foreground"
        }`}
      />
    ));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>{review.authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{review.author}</div>
              <div className="text-xs text-muted-foreground">{review.date}</div>
            </div>
          </div>
          <div className="flex">{renderStars(review.rating)}</div>
        </div>
        <h3 className="font-semibold mb-2">{review.title}</h3>
        <p className="text-muted-foreground text-sm">{review.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4" />
          <span>{review.helpfulCount} people found this helpful</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert(`Reply to ${review.author}`)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Reply
        </Button>
      </CardFooter>
    </Card>
  );
};

ProductReviewItem.propTypes = {
  review: PropTypes.shape({
    authorInitials: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    helpfulCount: PropTypes.number.isRequired,
  }).isRequired,
};