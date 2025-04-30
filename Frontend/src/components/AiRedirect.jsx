import React from 'react';

function AiRedirect() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 text-center">
      <a href="/login" className="mt-4 text-primary hover:underline">
        Login/Signup
      </a> as a user to use this feature
      </h1>
    </div>
  );
}

export default AiRedirect;
