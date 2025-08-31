
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UsedCarCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images?: string[];
  image?: string;
  currency: string;
  language?: string;
}

export const UsedCarCard = (props: UsedCarCardProps) => {
  const {
    make,
    model,
    year,
    price,
    mileage,
    images = [],
  image,
    currency,
    language = "en",
  } = props;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const imgs = (images && images.length) ? images : (image ? [image] : ["/placeholder.svg"]);

  useEffect(() => {
    // only auto-slide when there are multiple images
    if (paused || imgs.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % imgs.length);
    }, 3500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [imgs.length, paused]);
  const t = {
    buyNow: language === "fr" ? "Acheter" : "Buy Now",
    miles: language === "fr" ? "km" : "miles",
  };
  let displayPrice = "";
  if (currency === "US") {
    displayPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
  } else if (currency === "UK") {
    displayPrice = (price * 0.8).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  } else if (currency === "FR") {
    displayPrice = (price * 0.93).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  }
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-card border-0">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <img
          src={imgs[index]}
          alt={`${make} ${model}`}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
            {`${year} ${make} ${model}`}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {currency === "FR" ? (mileage * 1.60934).toLocaleString() : mileage.toLocaleString()} {t.miles}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {displayPrice}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 px-3"
              onClick={() => {
                let whatsappNumber = "+19714279184";
                let currencySymbol = "$";
                let convertedPrice = price.toLocaleString();
                if (currency === "UK") {
                  whatsappNumber = "+447427164150";
                  currencySymbol = "£";
                  convertedPrice = (price * 0.8).toLocaleString();
                } else if (currency === "FR") {
                  whatsappNumber = "+33712345678";
                  currencySymbol = "€";
                  convertedPrice = (price * 0.93).toLocaleString();
                }
                window.open(
                  `https://wa.me/${whatsappNumber}?text=${language === "fr" ? "Je suis intéressé par" : "I'm interested in"}%20the%20${year}%20${make}%20${model}%20-%20Price:%20${currencySymbol}${convertedPrice}`,
                  "_blank"
                );
              }}
            >
              {t.buyNow}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
