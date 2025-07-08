import { Button } from "@/components/ui/button";
import { Search, Wrench, Shield, Truck } from "lucide-react";

export const HeroSection = () => {
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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