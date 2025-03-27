import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../components/ui/tabs";

export const ProductTabs = () => {
  return (
    <div className="mt-12 space-y-8">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <p className="text-muted-foreground">
            Our organic apples are grown without pesticides, ensuring a pure
            taste. Each apple is handpicked to guarantee quality and freshness.
            Enjoy them in salads, desserts, or on their own!
          </p>
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <p className="text-muted-foreground">
            We ship all orders within 2-3 business days. Choose from standard or
            expedited shipping options at checkout. Enjoy fast and reliable
            delivery right to your door.
          </p>
        </TabsContent>
        <TabsContent value="returns" className="mt-4">
          <p className="text-muted-foreground">
            {
              "If you're not satisfied with your purchase, you can return it within 30 days for a full refund. Simply contact our customer service for assistance. Your satisfaction is our priority!"
            }
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};