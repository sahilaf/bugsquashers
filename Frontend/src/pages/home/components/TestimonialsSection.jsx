// components/TestimonialsSection.jsx
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { InfiniteMovingCards } from "../../../components/ui/infinite-moving-cards";
import {testimonialsData} from "../data/Data"; // Adjust the path as needed

const TestimonialsSection = () => {
  return (
    <div>
      <div className="flex flex-col items-center py-16">
        <Badge
          variant="outline"
          className="mb-4 px-4 py-1 text-sm bg-background"
        >
          Testimonials
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
          What Our Customers Say
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Don’t just take our word for it - hear from the people who use
          FAIRBASKET every day.
        </p>
      </div>
      <div className="h-full rounded-md flex flex-col antialiased bg-background dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonialsData}
          direction="right"
          speed="fast"
          className="bg-background"
          itemClassName="bg-card p-6 rounded-lg shadow-sm"
          quoteClassName="text-foreground text-lg"
          nameClassName="text-primary font-semibold mt-4"
          titleClassName="text-muted-foreground text-sm"
        />
      </div>
    </div>
  );
};

export default TestimonialsSection;