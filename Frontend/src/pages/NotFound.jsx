import React from "react";
import Lottie from "react-lottie-player";
import animationData from "../assets/404animation.json";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <Lottie
          loop
          animationData={animationData}
          play
          className="w-full max-w-md"
        />
        <h1 className="text-2xl font-bold mt-4">404 - Page Not Found</h1>
        <p className="text-lg mt-2">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
