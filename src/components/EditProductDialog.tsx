
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
import { useState } from "react";

export default function EditProductDialog({ product, setProducts }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [car, setCar] = useState(product.car);
  const [condition, setCondition] = useState(product.condition);
  const [stockStatus, setStockStatus] = useState(product.stock_status);
  const [part, setPart] = useState(product.part);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("car", car);
    formData.append("condition", condition);
    formData.append("stockStatus", stockStatus);
    formData.append("part", part);
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
    }
    fetch(`https://auto-salvage.onrender.com/api/products/${product.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((updatedProduct) => {
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === product.id ? updatedProduct : p))
        );
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit the details of your product.
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
          {product.images && product.images.length > 0 && (
            <div className="col-span-4 flex flex-wrap gap-2 mb-2">
              {product.images.map((img, i) => (
                <img key={i} src={img?.startsWith('/uploads/') ? `https://auto-salvage.onrender.com${img}` : img} alt="Current" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>
          )}
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
