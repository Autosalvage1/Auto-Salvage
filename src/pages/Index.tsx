import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailDialog } from "@/components/ProductDetailDialog";
import { UsedCarCard } from "@/components/UsedCarCard";
import { UsedCarDetailDialog } from "@/components/UsedCarDetailDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Grid, List, Search } from "lucide-react";


const translations = {
  en: {
    carParts: "Car Parts",
    usedCars: "Used Cars",
    featuredParts: "Featured Auto Parts",
    featuredPartsDesc: "Browse our extensive inventory of quality used and refurbished car parts from trusted salvage yards nationwide.",
    searchProducts: "Search products...",
    selectCar: "Select Car",
    allCars: "All Cars",
    selectCondition: "Select Condition",
    allConditions: "All Conditions",
    new: "New",
    used: "Used",
    selectStockStatus: "Select Stock Status",
    allStock: "All Stock Statuses",
    inStock: "In Stock",
    lowStock: "Low in Stock",
    selectPart: "Select Part",
    allParts: "All Parts",
    engine: "Engine",
    brakes: "Brakes",
    lighting: "Lighting",
    resultsParts: "parts found",
    loadMoreParts: "Load More Parts",
    usedCarsForSale: "Used Cars for Sale",
    usedCarsDesc: "Find your next reliable used car from our curated selection.",
    resultsCars: "cars found",
    loadMoreCars: "Load More Cars",
    footerDesc: "Your trusted source for quality auto parts and salvage solutions in the UK and US.",
    categories: "Categories",
    enginesTrans: "Engines & Transmissions",
    bodyParts: "Body Parts & Panels",
    electronics: "Electronics & ECUs",
    wheelsTires: "Wheels & Tires",
    services: "Services",
    partLookup: "Part Lookup",
    installSupport: "Installation Support",
    warranty: "Warranty Coverage",
    bulkOrders: "Bulk Orders",
    contact: "Contact",
    ukPhone: "UK-+44 7427 164150",
    usPhone: "US-+1 971 427 9184",
    email: "contactsupport@autosalvage.autos",
    hours: "Mon-Fri 8AM-6PM",
    shipping: "Nationwide Shipping",
    copyright: "© 2023 AutoSalvage. All rights reserved.",
  },
  fr: {
    carParts: "Pièces Auto",
    usedCars: "Voitures d'occasion",
    featuredParts: "Pièces Auto en Vedette",
    featuredPartsDesc: "Parcourez notre vaste inventaire de pièces auto d'occasion et reconditionnées provenant de casses de confiance à travers le pays.",
    searchProducts: "Rechercher des produits...",
    selectCar: "Sélectionner la voiture",
    allCars: "Toutes les voitures",
    selectCondition: "Sélectionner l'état",
    allConditions: "Tous les états",
    new: "Neuf",
    used: "Occasion",
    selectStockStatus: "Sélectionner le stock",
    allStock: "Tous les stocks",
    inStock: "En stock",
    lowStock: "Stock faible",
    selectPart: "Sélectionner la pièce",
    allParts: "Toutes les pièces",
    engine: "Moteur",
    brakes: "Freins",
    lighting: "Éclairage",
    resultsParts: "pièces trouvées",
    loadMoreParts: "Voir plus de pièces",
    usedCarsForSale: "Voitures d'occasion à vendre",
    usedCarsDesc: "Trouvez votre prochaine voiture d'occasion fiable parmi notre sélection.",
    resultsCars: "voitures trouvées",
    loadMoreCars: "Voir plus de voitures",
    footerDesc: "Votre source fiable pour des pièces auto de qualité et des solutions de casse en France.",
    categories: "Catégories",
    enginesTrans: "Moteurs & Transmissions",
    bodyParts: "Carrosserie & Panneaux",
    electronics: "Électronique & ECUs",
    wheelsTires: "Roues & Pneus",
    services: "Services",
    partLookup: "Recherche de pièce",
    installSupport: "Support d'installation",
    warranty: "Garantie",
    bulkOrders: "Commandes en gros",
    contact: "Contact",
    ukPhone: "UK-+44 7427 164150",
    usPhone: "US-+1 971 427 9184",
    email: "contactsupport@autosalvage.autos",
    hours: "Lun-Ven 8h-18h",
    shipping: "Livraison nationale",
    copyright: "© 2023 AutoSalvage. Tous droits réservés.",
  },
};

const Index = () => {
  const [currency, setCurrency] = useState("US");
  const [language, setLanguage] = useState("en");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [usedCars, setUsedCars] = useState([]);
  const [selectedUsedCar, setSelectedUsedCar] = useState(null);
  const [usedCarDetailOpen, setUsedCarDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"carParts" | "usedCars">("carParts");
  const t = translations[language];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "https://auto-salvage.onrender.com/api/products?";
        if (searchQuery) url += `name=${searchQuery}&`;
        if (selectedCar && selectedCar !== "all") url += `car=${selectedCar}&`;
        if (selectedCondition && selectedCondition !== "all")
          url += `condition=${selectedCondition}&`;
        if (selectedStockStatus && selectedStockStatus !== "all")
          url += `stock_status=${selectedStockStatus}&`;
        if (selectedPart && selectedPart !== "all") url += `part=${selectedPart}&`;

        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(
            data.map((product) => ({
              ...product,
              price: parseFloat(product.price),
            }))
          );
        } else {
          console.error("Error fetching products:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    const fetchUsedCars = async () => {
      try {
        let url = "https://auto-salvage.onrender.com/api/used_cars?";
        // Add filters for used cars here
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsedCars(
            data.map((car) => ({ ...car, price: parseFloat(car.price) }))
          );
        } else {
          console.error("Error fetching used cars:", data);
          setUsedCars([]);
        }
      } catch (error) {
        console.error("Error fetching used cars:", error);
        setUsedCars([]);
      }
    };

    if (activeTab === "carParts") {
      fetchProducts();
    } else {
      fetchUsedCars();
    }
  }, [
    searchQuery,
    selectedCar,
    selectedCondition,
    selectedStockStatus,
    selectedPart,
    activeTab,
  ]);

  const categories = ["All", "Engine", "Brakes", "Lighting", "Transmission", "Body", "Exhaust", "Suspension", "Electronics", "Wheels"];

  return (
    <div className="min-h-screen bg-background">
  <Header currency={currency} setCurrency={setCurrency} language={language} setLanguage={setLanguage} />
  <HeroSection language={language} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Button
            variant={activeTab === "carParts" ? "default" : "outline"}
            onClick={() => setActiveTab("carParts")}
            className="mr-4"
          >
            {t.carParts}
          </Button>
          <Button
            variant={activeTab === "usedCars" ? "default" : "outline"}
            onClick={() => setActiveTab("usedCars")}
          >
            {t.usedCars}
          </Button>
        </div>

        {activeTab === "carParts" && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">{t.featuredParts}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t.featuredPartsDesc}
                </p>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t.searchProducts}
                      className="pl-10 bg-muted/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select onValueChange={setSelectedCar} value={selectedCar}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.selectCar} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allCars}</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Ford">Ford</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedCondition} value={selectedCondition}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.selectCondition} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allConditions}</SelectItem>
                      <SelectItem value="new">{t.new}</SelectItem>
                      <SelectItem value="used">{t.used}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedStockStatus} value={selectedStockStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.selectStockStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allStock}</SelectItem>
                      <SelectItem value="in_stock">{t.inStock}</SelectItem>
                      <SelectItem value="low_stock">{t.lowStock}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setSelectedPart} value={selectedPart}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.selectPart} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.allParts}</SelectItem>
                      <SelectItem value="engine">{t.engine}</SelectItem>
                      <SelectItem value="brakes">{t.brakes}</SelectItem>
                      <SelectItem value="lighting">{t.lighting}</SelectItem>
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
                  {products.length} {t.resultsParts}
                </Badge>
              </div>

              {/* Product Grid */}
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
                }`}>
                {products.map((product) => (
                  <div key={product.id} onClick={() => { setSelectedProduct(product); setDetailOpen(true); }} className="cursor-pointer">
                    <ProductCard {...product} currency={currency} />
                  </div>
                ))}
  {/* Product Detail Dialog */}
  <ProductDetailDialog open={detailOpen} onOpenChange={setDetailOpen} product={selectedProduct} />
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8">
                  {t.loadMoreParts}
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
                <h2 className="text-4xl font-bold text-foreground mb-4">{t.usedCarsForSale}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t.usedCarsDesc}
                </p>
              </div>

              {/* Filters and Controls */}
              {/* Add filters for used cars here */}

              {/* Results Count */}
              <div className="mb-6">
                <Badge variant="secondary" className="text-sm">
                  {usedCars.length} {t.resultsCars}
                </Badge>
              </div>

              {/* Used Car Grid */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {usedCars.map((car) => (
                  <div key={car.id} onClick={() => { setSelectedUsedCar(car); setUsedCarDetailOpen(true); }} className="cursor-pointer">
                    <UsedCarCard {...car} currency={currency} />
                  </div>
                ))}
                <UsedCarDetailDialog open={usedCarDetailOpen} onOpenChange={setUsedCarDetailOpen} car={selectedUsedCar} />
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8">
                  {t.loadMoreCars}
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
              <p className="text-white/80">{t.footerDesc}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.categories}</h3>
              <ul className="space-y-2 text-white/80">
                <li>{t.enginesTrans}</li>
                <li>{t.bodyParts}</li>
                <li>{t.electronics}</li>
                <li>{t.wheelsTires}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.services}</h3>
              <ul className="space-y-2 text-white/80">
                <li>{t.partLookup}</li>
                <li>{t.installSupport}</li>
                <li>{t.warranty}</li>
                <li>{t.bulkOrders}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t.contact}</h3>
              <ul className="space-y-2 text-white/80">
                <li>{t.ukPhone}</li>
                <li>{t.usPhone}</li>
                <li>{t.email}</li>
                <li>{t.hours}</li>
                <li>{t.shipping}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>{t.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
