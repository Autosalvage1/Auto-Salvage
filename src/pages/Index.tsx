import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "@/data/products";
import { Filter, Grid, List } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All", "Engine", "Brakes", "Lighting", "Transmission", "Body", "Exhaust", "Suspension", "Electronics", "Wheels"];

  const filteredProducts = selectedCategory === "All" 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Product Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Auto Parts</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive inventory of quality used and refurbished car parts from trusted salvage yards nationwide.
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <Badge variant="secondary" className="text-sm">
              {filteredProducts.length} parts found
            </Badge>
          </div>

          {/* Product Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Parts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-automotive-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">AutoSalvage</span>
              </div>
              <p className="text-white/80">Your trusted source for quality auto parts and salvage solutions.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-white/80">
                <li>Engines & Transmissions</li>
                <li>Body Parts & Panels</li>
                <li>Electronics & ECUs</li>
                <li>Wheels & Tires</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-white/80">
                <li>Part Lookup</li>
                <li>Installation Support</li>
                <li>Warranty Coverage</li>
                <li>Bulk Orders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-white/80">
                <li>1-800-AUTO-PART</li>
                <li>support@autosalvage.com</li>
                <li>Mon-Fri 8AM-6PM</li>
                <li>Nationwide Shipping</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 AutoSalvage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
