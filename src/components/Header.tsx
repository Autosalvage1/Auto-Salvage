import React, { useEffect, useRef, useState } from "react";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";


interface HeaderProps {
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}


export const Header = ({ currency, setCurrency, language, setLanguage }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // focus the search input when sheet opens
      setTimeout(() => searchRef.current?.focus(), 120);
    }
  }, [open]);
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="hidden sm:inline text-lg font-semibold text-foreground">AutoSalvage</span>
          </div>

          {/* Center: visible on sm+ */}
          <div className="flex-1 hidden sm:block md:max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder={language === "fr" ? "Rechercher des pièces, marques, modèles..." : "Search for car parts, brands, models..."}
                className="pl-10 bg-muted/50 w-full rounded-lg"
              />
            </div>
          </div>

          {/* Right: Icons and mobile menu */}
          <div className="flex items-center gap-2">
            {/* Mobile only: search and menu sheet triggers */}
            <Sheet open={open} onOpenChange={setOpen}>
              <div className="flex items-center gap-2 sm:hidden">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </div>

              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle className="text-base">{language === "fr" ? "Recherche" : "Search"}</SheetTitle>
                  <SheetDescription className="text-sm">
                    {language === "fr" ? "Trouvez des pièces et changez la devise" : "Find parts and change currency"}
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-3">
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        ref={searchRef}
                        placeholder={language === "fr" ? "Rechercher des pièces, marques, modèles..." : "Search car parts, brands, models..."}
                        className="pl-10 w-full py-3"
                      />
                    </div>
                  </div>

                  {/* Segmented currency buttons for big tap targets */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Button
                        variant={currency === "US" ? "default" : "outline"}
                        className="flex-1 py-3"
                        onClick={() => {
                          setCurrency("US");
                          setLanguage("en");
                          setOpen(false);
                        }}
                      >
                        USD
                      </Button>
                      <Button
                        variant={currency === "UK" ? "default" : "outline"}
                        className="flex-1 py-3"
                        onClick={() => {
                          setCurrency("UK");
                          setLanguage("en");
                          setOpen(false);
                        }}
                      >
                        GBP
                      </Button>
                      <Button
                        variant={currency === "FR" ? "default" : "outline"}
                        className="flex-1 py-3"
                        onClick={() => {
                          setCurrency("FR");
                          setLanguage("fr");
                          setOpen(false);
                        }}
                      >
                        EUR
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{language === "fr" ? "Sélectionnez pour convertir les prix" : "Select to convert prices"}</p>
                  </div>
                </div>

                <SheetFooter className="mt-4">
                  <div className="w-full flex justify-end">
                    <SheetClose asChild>
                      <Button variant="ghost">{language === "fr" ? "Terminé" : "Done"}</Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Desktop: show inline currency buttons instead of dropdown/profile */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={currency === "US" ? "default" : "outline"}
                className="py-2 px-3"
                onClick={() => {
                  setCurrency("US");
                  setLanguage("en");
                }}
              >
                USD
              </Button>
              <Button
                variant={currency === "UK" ? "default" : "outline"}
                className="py-2 px-3"
                onClick={() => {
                  setCurrency("UK");
                  setLanguage("en");
                }}
              >
                GBP
              </Button>
              <Button
                variant={currency === "FR" ? "default" : "outline"}
                className="py-2 px-3"
                onClick={() => {
                  setCurrency("FR");
                  setLanguage("fr");
                }}
              >
                EUR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};