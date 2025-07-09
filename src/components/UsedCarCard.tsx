
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UsedCarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
}

export const UsedCarCard = ({
  make,
  model,
  year,
  price,
  mileage,
  image,
}: UsedCarCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={`${make} ${model}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {`${year} ${make} ${model}`}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {mileage.toLocaleString()} miles
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
              onClick={() =>
                window.open(
                  `https://wa.me/1234567890?text=I%27m%20interested%20in%20the%20${year}%20${make}%20${model}%20-%20Price:%20$${price.toLocaleString()}`,
                  "_blank"
                )
              }
            >
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
