"use client";

import React from "react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent
} from "../../../components/ui/card";

// Component for need help section
const NeedHelp = () => (
    <Card className="mt-4 bg-muted/30">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-2">Need Help?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Our customer service team is available 24/7 to assist you with any
          questions.
        </p>
        <Button variant="link" className="text-xs p-0 h-auto">
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );

export default NeedHelp;