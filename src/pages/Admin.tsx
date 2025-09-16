import EditProductDialog from "@/components/EditProductDialog";
import AddProductDialog from "@/components/AddProductDialog";
import EditUsedCarDialog from "@/components/EditUsedCarDialog";
import AddUsedCarDialog from "@/components/AddUsedCarDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";

interface AdminProps {
  currency: string;
  toggleCurrency: () => void;
}

export default function Admin({ currency, toggleCurrency }: AdminProps) {
  const [products, setProducts] = useState([]);
  const [usedCars, setUsedCars] = useState([]);
  const [activeTab, setActiveTab] = useState<"carParts" | "usedCars">("carParts");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (activeTab === "carParts") {
      fetch("https://auto-salvage.onrender.com/api/products")
        .then((res) => res.json())
        .then((data) => {
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
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setProducts([]);
        });
    } else {
      fetch("https://auto-salvage.onrender.com/api/used_cars")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUsedCars(
              data.map((car) => ({ ...car, price: parseFloat(car.price) }))
            );
          } else {
            console.error("Error fetching used cars:", data);
            setUsedCars([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching used cars:", error);
          setUsedCars([]);
        });
    }
  }, [activeTab, isLoggedIn]);

  const handleDeleteProduct = (id) => {
    fetch(`https://auto-salvage.onrender.com/api/products/${id}`, {
      method: "DELETE",
    }).then(() => {
      setProducts(products.filter((product) => product.id !== id));
    });
  };

  const handleDeleteUsedCar = (id) => {
    fetch(`https://auto-salvage.onrender.com/api/used_cars/${id}`, {
      method: "DELETE",
    }).then(() => {
      setUsedCars(usedCars.filter((car) => car.id !== id));
    });
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("https://auto-salvage.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div>
          <Button
            variant={activeTab === "carParts" ? "default" : "outline"}
            onClick={() => setActiveTab("carParts")}
            className="mr-4"
          >
            Car Parts
          </Button>
          <Button
            variant={activeTab === "usedCars" ? "default" : "outline"}
            onClick={() => setActiveTab("usedCars")}
          >
            Used Cars
          </Button>
        </div>
        {activeTab === "carParts" ? (
          <AddProductDialog setProducts={setProducts} />
        ) : (
          <AddUsedCarDialog setUsedCars={setUsedCars} />
        )}
      </div>
      {activeTab === "carParts" ? (
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
                    src={product.images && product.images.length ? product.images[0] : (product.image || "/placeholder.svg")}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.part}</TableCell>
                <TableCell>{product.car}</TableCell>
                <TableCell>{product.condition}</TableCell>
                <TableCell>{product.stock_status}</TableCell>
                <TableCell>${typeof product.price === 'number' && !isNaN(product.price) ? product.price.toFixed(2) : "N/A"}</TableCell>
                <TableCell>
                  <EditProductDialog product={product} setProducts={setProducts} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usedCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <img
                    src={car.images && car.images.length ? car.images[0] : (car.image || "/placeholder.svg")}
                    alt={`${car.make} ${car.model}`}
                    className="w-16 h-16 object-cover"
                  />
                </TableCell>
                <TableCell>{car.make}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>${typeof car.price === 'number' && !isNaN(car.price) ? car.price.toFixed(2) : "N/A"}</TableCell>
                <TableCell>{car.mileage.toLocaleString()}</TableCell>
                <TableCell>
                  <EditUsedCarDialog usedCar={car} setUsedCars={setUsedCars} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUsedCar(car.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
