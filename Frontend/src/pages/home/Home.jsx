// pages/Index.jsx
import React from "react";
import Hero from "./components/Hero";
import Bento from "./components/Bento";
import Footer from "./components/Footer";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CallToActionSection from "./components/CallToActionSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Bento />
      <HowItWorksSection />
      <FeaturesSection />
      
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Index;