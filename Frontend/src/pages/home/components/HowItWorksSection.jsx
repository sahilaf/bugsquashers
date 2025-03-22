// components/HowItWorksSection.jsx
import React from "react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-float1">
              <span className="text-3xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Scan</h3>
            <p className="text-muted-foreground">
              Scan any product to find it in our marketplace.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-secondary text-secondary-foreground rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-float2">
              <span className="text-3xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Order</h3>
            <p className="text-muted-foreground">
              Place your order with ease.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent text-accent-foreground rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-float3">
              <span className="text-3xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Deliver</h3>
            <p className="text-muted-foreground">
              Our riders will deliver your order quickly.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 animate-float4">
              <span className="text-3xl">4</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Enjoy</h3>
            <p className="text-muted-foreground">
              Enjoy fresh groceries delivered to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;