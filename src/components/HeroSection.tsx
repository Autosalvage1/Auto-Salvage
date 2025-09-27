import { Button } from "@/components/ui/button";
import { Search, Wrench, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const HeroSection = () => {
  const imageGroups = [
    ["/victoire/board1.jpeg", "/victoire/board2.jpeg", "/victoire/board3.jpeg", "/victoire/board4.jpeg"],
    ["/victoire/bumber1.jpeg", "/victoire/bumber2.jpeg", "/victoire/bumber3.jpeg", "/victoire/bumber4.jpeg"],
    ["/victoire/hardtop1.jpeg", "/victoire/hardtop2.jpeg", "/victoire/hardtop3.jpeg", "/victoire/hardtop4.jpeg"],
    ["/victoire/hillux1.jpeg", "/victoire/hillux2.jpeg", "/victoire/hillux3.jpeg", "/victoire/hillux4.jpeg"],
  ];
  const allImages = imageGroups.flat();

  return (
    <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Premium Auto Parts
            <span className="block text-primary">& Salvage Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Discover quality used and refurbished car parts from trusted salvage yards. 
            Save money while keeping your vehicle running at its best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              <Search className="mr-2 h-5 w-5" />
              Find Parts Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-foreground">
              Browse Catalog
            </Button>
          </div>
        </div>

        <Carousel
          plugins={[Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })]}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {allImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
                      <img src={src} alt={`Salvage part ${index + 1}`} className="w-full h-full object-cover" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2 fill-white" />
          <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2 fill-white" />
        </Carousel>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-white/80">All parts tested and guaranteed to work</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">30-Day Warranty</h3>
            <p className="text-white/80">Peace of mind with every purchase</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
            <p className="text-white/80">Get your parts delivered quickly</p>
          </div>
        </div>
      </div>
    </section>
  );
};