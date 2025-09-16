
export interface Product {
  id: string;
  name: string;
  price: number;
  car: string;
  year?: string;
  images: string[];
  condition: "New" | "Used" | "Refurbished";
  availability: "In Stock" | "Low Stock" | "Out of Stock";
  category: string;
  type: "car_part";
}

export interface UsedCar {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  type: "used_car";
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Complete Engine Assembly",
    price: 2500,
    car: "Toyota Camry",
    year: "2018-2020",
    images: [
      "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558439297-6d64de180fa3?w=400&h=300&fit=crop"
    ],
    condition: "Refurbished",
    availability: "In Stock",
    category: "Engine",
    type: "car_part",
  },
  {
    id: "2",
    name: "Front Brake Caliper Set",
    price: 180,
    car: "Honda Civic",
    year: "2016-2019",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop"
    ],
    condition: "Used",
    availability: "In Stock",
    category: "Brakes",
    type: "car_part",
  },
  {
    id: "3",
    name: "Left Headlight Assembly",
    price: 120,
    car: "Ford F-150",
    year: "2017-2021",
    images: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1580414329544-cddfa1abc36d?w=400&h=300&fit=crop"
    ],
    condition: "Used",
    availability: "Low Stock",
    category: "Lighting",
    type: "car_part",
  },
  {
    id: "4",
    name: "Transmission - Automatic",
    price: 1800,
    car: "Chevrolet Silverado",
    year: "2015-2018",
    images: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop"
    ],
    condition: "Refurbished",
    availability: "In Stock",
    category: "Transmission",
    type: "car_part",
  },
  {
    id: "5",
    name: "Driver Side Door",
    price: 350,
    car: "BMW 3 Series",
    year: "2019-2022",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop"
    ],
    condition: "Used",
    availability: "Out of Stock",
    category: "Body",
    type: "car_part",
  },
  {
    id: "6",
    name: "Catalytic Converter",
    price: 420,
    car: "Nissan Altima",
    year: "2016-2020",
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop"
    ],
    condition: "New",
    availability: "In Stock",
    category: "Exhaust",
    type: "car_part",
  },
  {
    id: "7",
    name: "Rear Axle Assembly",
    price: 680,
    car: "Jeep Wrangler",
    year: "2014-2018",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
    ],
    condition: "Used",
    availability: "In Stock",
    category: "Suspension",
    type: "car_part",
  },
  {
    id: "8",
    name: "ECU/PCM Module",
    price: 290,
    car: "Mazda CX-5",
    year: "2017-2021",
    images: [
      "https://images.unsplash.com/photo-1580414329544-cddfa1abc36d?w=400&h=300&fit=crop"
    ],
    condition: "Refurbished",
    availability: "Low Stock",
    category: "Electronics",
    type: "car_part",
  },
  {
    id: "9",
    name: "Complete Wheel Set (4)",
    price: 320,
    car: "Subaru Outback",
    year: "2015-2019",
    images: [
      "https://images.unsplash.com/photo-1558439297-6d64de180fa3?w=400&h=300&fit=crop"
    ],
    condition: "Used",
    availability: "In Stock",
    category: "Wheels",
    type: "car_part",
  },
];

export const sampleUsedCars: UsedCar[] = [
  {
    id: "10",
    make: "Honda",
    model: "Civic",
    year: 2020,
    price: 18000,
    mileage: 30000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    type: "used_car",
  },
  {
    id: "11",
    make: "Toyota",
    model: "Camry",
    year: 2019,
    price: 22000,
    mileage: 40000,
    image: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=400&h=300&fit=crop",
    type: "used_car",
  },
  {
    id: "12",
    make: "Ford",
    model: "F-150",
    year: 2018,
    price: 25000,
    mileage: 50000,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
    type: "used_car",
  },
];
