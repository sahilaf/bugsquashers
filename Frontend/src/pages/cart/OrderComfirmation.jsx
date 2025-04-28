// OrderConfirmation.js
import React from 'react';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-8">Order Confirmation</h1>
      
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold text-green-800">
              Thank you for your order!
            </h2>
            <a className="text-green-600 hover:underline" href="/market">
              Shop more
            </a>
          </div>
          
          
        </div>
    </div>
  );
};

export default OrderConfirmation;
