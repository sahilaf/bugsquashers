import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";

export const ProductGallery = () => {
  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <img
            src="https://placehold.co/600x600?text=Organic+Apples"
            alt="Organic Apples"
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary h-8 w-8"
            onClick={() => alert("Previous image")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary h-8 w-8"
            onClick={() => alert("Next image")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      <div className="flex justify-center gap-1 mt-4">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full ${
              i === 0 ? "bg-primary" : "bg-gray-300"
            }`}
            onClick={() => alert(`Navigate to image ${i + 1}`)}
            style={{ cursor: "pointer" }}
            aria-label={`Navigate to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};