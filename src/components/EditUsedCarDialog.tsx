
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";


export default function EditUsedCarDialog({ usedCar, setUsedCars }) {
  const [make, setMake] = useState(usedCar.make);
  const [model, setModel] = useState(usedCar.model);
  const [year, setYear] = useState(usedCar.year);
  const [price, setPrice] = useState(usedCar.price);
  const [mileage, setMileage] = useState(usedCar.mileage);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year.toString());
    formData.append("price", price.toString());
    formData.append("mileage", mileage.toString());
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
    }
    fetch(`https://auto-salvage.onrender.com/api/used_cars/${usedCar.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((updatedUsedCar) => {
        setUsedCars((prevUsedCars) =>
          prevUsedCars.map((uc) => (uc.id === usedCar.id ? updatedUsedCar : uc))
        );
      });
  };


