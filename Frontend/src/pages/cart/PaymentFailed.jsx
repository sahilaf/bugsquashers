import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AlertCircle } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="border-red-100 shadow-lg">
        <CardHeader className="text-center bg-red-50 border-b border-red-100">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-center text-gray-700">
            We were unable to process your payment. Your order has not been confirmed.
          </p>
          
          <p className="text-center text-gray-700">
            Please try again or use a different payment method.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate('/cart')}
              variant="outline"
              className="flex-1"
            >
              Return to Cart
            </Button>
            <Button 
              onClick={() => navigate('/checkout')}
              className="flex-1"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;