export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  items: string[];
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERING' | 'COMPLETED' | 'PAID';
}

export interface Driver {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  vehicleNo: string;
  rating: number;
  workingHours: string;
  experienceYears: number;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE';
  imageUrl: string;
}