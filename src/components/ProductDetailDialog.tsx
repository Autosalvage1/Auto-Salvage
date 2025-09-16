import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

export const ProductDetailDialog = ({ open, onOpenChange, product }: ProductDetailDialogProps) => {
  if (!product) return null;
  const { name, price, car, year, images = [], image, condition, stockStatus, part, currency, language = "en" } = product;
  const imgs = (images && images.length) ? images : (image ? [image] : ["/placeholder.svg"]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused || imgs.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % imgs.length);
    }, 2000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [imgs.length, paused]);

  let displayPrice = "";
  if (currency === "US") {
    displayPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
  } else if (currency === "UK") {
    displayPrice = (price * 0.8).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  } else if (currency === "FR") {
    displayPrice = (price * 0.93).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="relative overflow-hidden mb-4" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <img src={imgs[index]} alt={name} className="w-full h-64 object-cover rounded" />
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
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Badge>{condition}</Badge>
            <Badge>{stockStatus}</Badge>
          </div>
          <div className="text-lg font-semibold">{displayPrice}</div>
          <div className="text-muted-foreground text-sm">{part} for {car} {year && `(${year})`}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
