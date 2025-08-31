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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/data/products";
import { useState } from "react";

export default function AddProductDialog({ setProducts }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [car, setCar] = useState("");
  const [condition, setCondition] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [part, setPart] = useState("");

  const handleSubmit = () => {
    fetch("https://auto-salvage.onrender.com/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  body: JSON.stringify({ name, price, images: imagesText.split(/\n|,\s*/), car, condition, stockStatus, part }),
    })
      .then((res) => res.json())
      .then((newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to your store.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="part" className="text-right">
              Part
            </Label>
            <Input
              id="part"
              className="col-span-3"
              value={part}
              onChange={(e) => setPart(e.target.value)}
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="images" className="text-right">
              Image URLs
            </Label>
            <textarea
              id="images"
              className="col-span-3 rounded-md border p-2 bg-muted/50"
              placeholder="One URL per line or comma separated"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="car" className="text-right">
              Car
            </Label>
            <Input
              id="car"
              className="col-span-3"
              value={car}
              onChange={(e) => setCar(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="condition" className="text-right">
              Condition
            </Label>
            <Select onValueChange={setCondition} value={condition}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stockStatus" className="text-right">
              Stock Status
            </Label>
            <Select onValueChange={setStockStatus} value={stockStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low in Stock</SelectItem>
              </SelectContent>
            </Select>
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