
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


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Used Car</DialogTitle>
          <DialogDescription>
            Edit the details of your used car.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="make" className="text-right">
              Make
            </Label>
            <Input
              id="make"
              className="col-span-3"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              className="col-span-3"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              className="col-span-3"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mileage" className="text-right">
              Mileage
            </Label>
            <Input
              id="mileage"
              type="number"
              className="col-span-3"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="images" className="text-right">
              Upload Images
            </Label>
            <input
              id="images"
              className="col-span-3"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>
          {usedCar.images && usedCar.images.length > 0 && (
            <div className="col-span-4 flex flex-wrap gap-2 mb-2">
              {usedCar.images.map((img, i) => (
                <img key={i} src={img?.startsWith('/uploads/') ? `https://auto-salvage.onrender.com${img}` : img} alt="Current" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


