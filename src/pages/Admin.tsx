
import EditProductDialog from "@/components/EditProductDialog";
import AddProductDialog from "@/components/AddProductDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";

export default function Admin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://auto-salvage.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.map(product => ({ ...product, price: parseFloat(product.price) }))));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProducts(products.filter((product) => product.id !== id));
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <AddProductDialog setProducts={setProducts} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Part</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Stock Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.part}</TableCell>
              <TableCell>{product.car}</TableCell>
              <TableCell>{product.condition}</TableCell>
              <TableCell>{product.stock_status}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <EditProductDialog product={product} setProducts={setProducts} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
