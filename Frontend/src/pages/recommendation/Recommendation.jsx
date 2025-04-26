import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle, Loader2, MapPin } from "lucide-react";

const formSchema = z.object({
  budget: z.number().min(1, "Budget must be at least $1"),
  prompt: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(3, "Please provide a valid location"),
});

export default function RecommendationForm() {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 0,
      prompt: "",
      location: "",
    },
  });

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      setResults({});

      const response = await fetch('http://127.0.0.1:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: values.budget,
          prompt: values.prompt,
          location: values.location
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Product Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your budget"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum amount you want to spend
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are you looking for?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe the products you need"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Example: "Organic fruits for a family of four"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter your location"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        City or postal code for local recommendations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Searching..." : "Get Recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{results.error}</AlertDescription>
        </Alert>
      )}

      {results.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              {results.recommendations}
            </div>

            {results.products && results.products.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Matching Products</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.products.map((product) => (
                    <Card key={product.id} className="hover:bg-accent/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {product.content.split('\n')[0]?.replace('Name: ', '')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.content.split('\n')[1]?.replace('Description: ', '')}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold">
                              ${product.price}
                            </span>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{product.location}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}