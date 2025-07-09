import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { UsedCarCard } from "@/components/UsedCarCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Grid, List, Search } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [usedCars, setUsedCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"carParts" | "usedCars">("carParts");

  useEffect(() => {
    const fetchProducts = async () => {
      let url = "https://auto-salvage.onrender.com/api/products?";
      if (searchQuery) url += `name=${searchQuery}&`;
      if (selectedCar && selectedCar !== "all") url += `car=${selectedCar}&`;
      if (selectedCondition && selectedCondition !== "all") url += `condition=${selectedCondition}&`;
      if (selectedStockStatus && selectedStockStatus !== "all") url += `stock_status=${selectedStockStatus}&`;
      if (selectedPart && selectedPart !== "all") url += `part=${selectedPart}&`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.map(product => ({ ...product, price: parseFloat(product.price) })));
    };

    const fetchUsedCars = async () => {
      let url = "https://auto-salvage.onrender.com/api/used_cars?";
      // Add filters for used cars here
      const res = await fetch(url);
      const data = await res.json();
      setUsedCars(data.map(car => ({ ...car, price: parseFloat(car.price) })));
    };

    if (activeTab === "carParts") {
      fetchProducts();
    } else {
      fetchUsedCars();
    }
  }, [searchQuery, selectedCar, selectedCondition, selectedStockStatus, selectedPart, activeTab]);

  const categories = ["All", "Engine", "Brakes", "Lighting", "Transmission", "Body", "Exhaust", "Suspension", "Electronics", "Wheels"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Button
            variant={activeTab === "carParts" ? "default" : "outline"}
            onClick={() => setActiveTab("carParts")}
            className="mr-4"
          >
            Car Parts
          </Button>
          <Button
            variant={activeTab === "usedCars" ? "default" : "outline"}
            onClick={() => setActiveTab("usedCars")}
          >
            Used Cars
          </Button>
        </div>

        {activeTab === "carParts" && (
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
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 bg-muted/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select onValueChange={setSelectedCar} value={selectedCar}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Car" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cars</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedCondition} value={selectedCondition}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedStockStatus} value={selectedStockStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock Statuses</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low in Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedPart} value={selectedPart}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parts</SelectItem>
                      <SelectItem value="engine">Engine</SelectItem>
                      <SelectItem value="brakes">Brakes</SelectItem>
                      <SelectItem value="lighting">Lighting</SelectItem>
                    </SelectContent>
                  </Select>
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
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <Badge variant="secondary" className="text-sm">
                  {products.length} parts found
                </Badge>
              </div>

              {/* Product Grid */}
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                }`}>
                {products.map((product) => (
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
        )}

        {activeTab === "usedCars" && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">Used Cars for Sale</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Find your next reliable used car from our curated selection.
                </p>
              </div>

              {/* Filters and Controls */}
              {/* Add filters for used cars here */}

              {/* Results Count */}
              <div className="mb-6">
                <Badge variant="secondary" className="text-sm">
                  {usedCars.length} cars found
                </Badge>
              </div>

              {/* Used Car Grid */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {usedCars.map((car) => (
                  <UsedCarCard key={car.id} {...car} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8">
                  Load More Cars
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

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