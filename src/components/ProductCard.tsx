import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  car: string;
  year?: string;
  image: string;
  condition: string;
  stockStatus: string;
  part: string;
}

export const ProductCard = ({
  name,
  price,
  car,
  year,
  image,
  condition,
  stockStatus,
  part,
}: ProductCardProps) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "low_stock":
        return "bg-automotive-orange/10 text-automotive-orange border-automotive-orange/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {condition}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className={`border ${getAvailabilityColor(stockStatus)}`}>
            {stockStatus === "in_stock" ? "In Stock" : "Low Stock"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {part} for {car} {year && `(${year})`}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 px-3"
              disabled={stockStatus === "out_of_stock"}
              onClick={() => window.open(`https://wa.me/1234567890?text=I%27m%20interested%20in%20the%20${name}%20(${part})%20for%20${car}%20(${year})%20-%20Price:%20$${price.toLocaleString()}`, '_blank')}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};