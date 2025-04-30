// components/FeaturesSection.jsx
import React from "react";
import { CheckCircle, Users, Truck } from "lucide-react";
import Lottie from "react-lottie-player";
import HeroAnimation from "../assets/1"; // Adjust paths as needed
import DeliveryAnimation from "../assets/2";
import FarmersAnimation from "../assets/3";
import SavingsAnimation from "../assets/4";
import {featuresData} from "../data/Data"; // Adjust the path as needed

// Map animation names to their corresponding imports
const animationMap = {
  HeroAnimation,
  DeliveryAnimation,
  FarmersAnimation,
  SavingsAnimation,
};

// Map icon names to their corresponding components
const iconMap = {
  CheckCircle,
  Users,
  Truck,
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden px-4 sm:px-8 lg:px-32">
      <div className="container mx-auto relative">
        <div className="flex flex-col items-center text-center mb-12 md:mb-20">
          <span className="mb-3 px-4 py-1 text-sm bg-background border border-border rounded-full">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose FairBasket?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We’re revolutionizing the grocery supply chain with technology
            that benefits everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {featuresData.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            const AnimationComponent = animationMap[feature.animation];

            return (
              <div
                key={feature.id}
                className={`flex flex-col items-center space-y-6 md:flex-row ${
                  feature.layout === "right" ? "md:flex-row-reverse" : ""
                } md:space-y-0 md:space-x-8`}
              >
                <div className="space-y-4 flex-1 order-2 md:order-1">
                  <div className="flex items-start space-x-4">
                    <IconComponent
                      className={`w-8 h-8 ${feature.iconColor} flex-shrink-0`}
                    />
                    <div>
                      <h3 className="text-3xl font-semibold pb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex justify-center order-1 md:order-2">
                  <Lottie
                    loop
                    animationData={AnimationComponent}
                    play
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;