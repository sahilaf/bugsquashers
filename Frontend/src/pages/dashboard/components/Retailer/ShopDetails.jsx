"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Checkbox } from "../../../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Pencil, Save, XCircle, CheckCircle2 } from "lucide-react";

export function ShopDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [shop, setShop] = useState({
    id: "123",
    name: "Organic Groceries",
    location: "New York, NY",
    category: "Grocery",
    isCertified: true,
  });

  const form = useForm({
    defaultValues: shop,
  });

  useEffect(() => {
    form.reset(shop);
  }, [shop, form]);

  const onSubmit = (data) => {
    setShop(data);
    setIsEditing(false);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Shop Information</CardTitle>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Shop name"
                      />
                    </FormControl>
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
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Category"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="isCertified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Organic Certified</FormLabel>
                        <div className="flex items-center gap-2 mt-1">
                          {shop.isCertified ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Certified
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                Not Certified
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ShopDetails;