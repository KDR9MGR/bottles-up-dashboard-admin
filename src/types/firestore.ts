export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  numberOfTickets: number;
  totalPrice: number;
  status: string;
  bookedAt: Date;
  eventDetails: {
    title: string;
    venue: string;
    date: Date;
    imageUrl: string;
  };
}

export interface BottleCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: number;
  price: number;
  capacity: number;
  bookedSeats: number;
  status: string;
  featured: boolean;
  vendorId: string;
  createdAt: number;
  updatedAt: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  volume: number;
  quantity?: number;
  stock?: number;
  categoryId?: string;
  category?: string;
  imageUrl: string | null;
  featured: boolean;
  vendorId?: string;
  alcoholContent?: number;
  unit?: string;
  tags?: string[];
  minStock?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  lastSignInTime: Date;
  favorites: number;
  rating: number;
  location: string | null;
  eventsAttended: number;
}

export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  profileImageUrl: string | null;
  permissions: string[];
  createdAt: number;
  lastLoginAt: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
}

export interface Mixer {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
} 