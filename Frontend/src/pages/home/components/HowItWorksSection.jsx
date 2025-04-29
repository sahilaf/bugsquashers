import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { HeadsetIcon, BrainIcon, ShieldCheckIcon } from "lucide-react";

function HowItWorksSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-300">
          Smarter Grocery Shopping with FairBasket
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Left Side - AI Budget Recommendation */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <BrainIcon className="w-8 h-8 text-foreground" />
                <CardTitle className="text-2xl">AI Budget Recommendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <p className="text-gray-300 mb-4">
                Our AI helps you find the perfect grocery combinations within your budget:
              </p>
              <ul className="space-y-3 list-disc pl-6 text-gray-300">
                <li>Get the best products without overspending</li>
                <li>Prioritize organic and healthy options</li>
                <li>Mix and match across multiple nearby shops</li>
                <li>Personalized suggestions based on your needs</li>
              </ul>
            </CardContent>
          </Card>

          {/* Right Side - AI Chat Support Agent */}
          <Card className="flex flex-col hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <HeadsetIcon className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">AI Chat Support Agent</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <p className="text-gray-300 mb-4">
                Need help while shopping? Our AI support is always ready:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-300" />
                  <span className="text-gray-300">Secure order assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                    <path d="m7.5 4.27 9 5.15"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <line x1="12" x2="12" y1="22" y2="12"></line>
                  </svg>
                  <span className="text-gray-300">Instant AI chat help</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-gray-300">Order tracking assistance</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-semibold mb-6 text-foreground">
            Ready to Experience Smart Grocery Shopping?
          </h3>
          <Button 
            className="bg-primary h-12 px-8 text-lg" 
            onClick={() => window.location.href = '/recommendation'}
          >
            Get AI Budget Plan
          </Button>
          <p className="mt-4 text-gray-300 text-sm">
            100% free, quick, and easy to start!
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
