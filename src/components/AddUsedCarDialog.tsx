
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
import { useState } from "react";

export default function AddUsedCarDialog({ setUsedCars }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [price, setPrice] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [image, setImage] = useState("");

  const handleSubmit = () => {
    fetch("https://auto-salvage.onrender.com/api/used_cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ make, model, year, price, mileage, image }),
    })
      .then((res) => res.json())
      .then((newUsedCar) => {
        setUsedCars((prevUsedCars) => [...prevUsedCars, newUsedCar]);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Used Car</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Used Car</DialogTitle>
          <DialogDescription>
            Add a new used car to your store.
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
            <Label htmlFor="image" className="text-right">
              Image URL
            </Label>
            <Input
              id="image"
              className="col-span-3"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
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
