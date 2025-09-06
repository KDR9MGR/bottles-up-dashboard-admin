import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Booking, 
  BottleCategory, 
  Category, 
  Event, 
  InventoryItem, 
  User, 
  Vendor,
  Promotion,
  Mixer
} from '../types/firestore';

// Generic hook for fetching collections
const useCollection = <T>(collectionName: string, orderByField?: string, limitCount?: number) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, collectionName));
        
        if (orderByField) {
          q = query(q, orderBy(orderByField, 'desc'));
        }
        
        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        const items: T[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert Firestore timestamps to dates where needed
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate();
          }
          if (data.lastSignInTime && typeof data.lastSignInTime.toDate === 'function') {
            data.lastSignInTime = data.lastSignInTime.toDate();
          }
          if (data.bookedAt && typeof data.bookedAt.toDate === 'function') {
            data.bookedAt = data.bookedAt.toDate();
          }
          if (data.eventDetails?.date && typeof data.eventDetails.date.toDate === 'function') {
            data.eventDetails.date = data.eventDetails.date.toDate();
          }
          
          items.push({ ...data, id: doc.id } as T);
        });
        
        setData(items);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, orderByField, limitCount]);

  return { data, loading, error };
};

// Specific hooks for each collection
export const useBookings = (limitCount = 10) => 
  useCollection<Booking>('bookings', 'bookedAt', limitCount);

export const useBottleCategories = () => 
  useCollection<BottleCategory>('bottleCategories');

export const useCategories = () => 
  useCollection<Category>('categories');

export const useEvents = (limitCount = 10) => 
  useCollection<Event>('events', 'createdAt', limitCount);

export const useInventory = (limitCount = 20) => 
  useCollection<InventoryItem>('inventory', 'createdAt', limitCount);

export const useUsers = (limitCount = 10) => 
  useCollection<User>('users', 'createdAt', limitCount);

export const useVendors = () => 
  useCollection<Vendor>('vendors');

export const usePromotions = () => 
  useCollection<Promotion>('promotions');

export const useMixers = () => 
  useCollection<Mixer>('mixers');

// Featured items hook
export const useFeaturedItems = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'inventory'),
          where('featured', '==', true),
          limit(6)
        );

        const querySnapshot = await getDocs(q);
        const items: InventoryItem[] = [];
        
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id } as InventoryItem);
        });
        
        setData(items);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching featured items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return { data, loading, error };
};

// Stats hook for dashboard
export const useStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalInventory: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch counts from each collection
        const [usersSnap, eventsSnap, bookingsSnap, inventorySnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'events')),
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'inventory'))
        ]);

        let totalRevenue = 0;
        bookingsSnap.forEach((doc) => {
          const booking = doc.data();
          totalRevenue += booking.totalPrice || 0;
        });

        setStats({
          totalUsers: usersSnap.size,
          totalEvents: eventsSnap.size,
          totalBookings: bookingsSnap.size,
          totalRevenue,
          totalInventory: inventorySnap.size,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}; 