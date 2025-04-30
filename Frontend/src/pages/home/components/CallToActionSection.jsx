// components/CallToActionSection.jsx
import React from "react";
import { Button } from "../../../components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToActionSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-background opacity-70"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-12 shadow-xl border border-border relative overflow-hidden">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
              Join FairBasket Today
            </h2>
            <p className="text-muted-foreground text-center mb-8 text-lg">
              Experience the future of grocery shopping and be part of a
              sustainable ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-6 text-lg group rounded-full"
                onClick={() => window.location.href = "/market"}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className=" bg-secondary hover:bg-secondary-hover px-8 py-6 text-lg rounded-full"
                onClick={() => window.location.href = "https://github.com/Learnathon-By-Geeky-Solutions/bugsquashers/wiki"}
              >
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">1,000+</span>{" "}
                people joined last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;