import { Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

export function TodaysHeroes() {
  const topProducts = [
    { id: "milk", name: "Cow Milk", sales: 42 },
    { id: "egg", name: "Eggs", sales: 38 },
    { id: "chesse", name: "salted chesse", sales: 27 },
  ];

  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Heroes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={product.name} />
                  <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{product.name}</div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{product.sales} sold</span>
              </div>
            </div>
          ))}
        </div>
        <CardDescription className="mt-3 text-xs">Top selling products today</CardDescription>
      </CardContent>
    </Card>
  );
}
