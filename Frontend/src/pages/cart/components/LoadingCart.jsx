"use client";

import React from "react";
import {
  Card,
  CardContent,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { v4 as uuidv4 } from "uuid";

const LoadingCart = () => (
  <div className="container mx-auto px-4 py-8 mt-20">
    <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-6">
            {Array.from({ length: 3 }).map(() => (
              <div key={uuidv4()} className="flex gap-4 mb-6">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map(() => (
                <Skeleton key={uuidv4()} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default LoadingCart;
