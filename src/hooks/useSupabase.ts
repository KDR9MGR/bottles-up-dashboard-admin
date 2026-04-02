import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type {
  Profile, Vendor, Club, Event,
  VendorInventory, EventsBooking, ClubsBooking, Review
} from '../types/supabase'

function useSupabaseData<T>(tableName: string) {
  const [data, setData] = useState<T[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data: result, error: fetchError, count: totalCount } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
        if (fetchError) throw fetchError
        setData(result || [])
        setCount(totalCount || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error(`Error fetching ${tableName}:`, err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tableName])

  return { data, count, loading, error }
}

export function useProfiles() {
  return useSupabaseData<Profile>('profiles')
}

export function useVendors() {
  return useSupabaseData<Vendor>('vendors')
}

export function useClubs() {
  return useSupabaseData<Club>('clubs')
}

export function useEvents() {
  return useSupabaseData<Event>('events')
}

export function useVendorInventory() {
  return useSupabaseData<VendorInventory>('vendor_inventory')
}

export function useEventsBookings() {
  return useSupabaseData<EventsBooking>('events_bookings')
}

export function useClubsBookings() {
  return useSupabaseData<ClubsBooking>('clubs_bookings')
}

export function useReviews() {
  return useSupabaseData<Review>('reviews')
}

export function useDashboardStats() {
  const { count: totalUsers, loading: usersLoading, error: usersError } = useProfiles()
  const { count: totalVendors, loading: vendorsLoading, error: vendorsError } = useVendors()
  const { count: totalClubs, loading: clubsLoading, error: clubsError } = useClubs()
  const { count: totalEvents, loading: eventsLoading, error: eventsError } = useEvents()
  const { count: totalInventory, loading: inventoryLoading } = useVendorInventory()
  const { count: totalClubBookings, loading: clubBookingsLoading } = useClubsBookings()
  const { count: totalEventBookings, loading: eventBookingsLoading } = useEventsBookings()

  const loading = usersLoading || vendorsLoading || clubsLoading || eventsLoading || inventoryLoading || clubBookingsLoading || eventBookingsLoading
  const error = usersError || vendorsError || clubsError || eventsError

  return {
    stats: {
      totalUsers,
      totalVendors,
      totalClubs,
      totalEvents,
      totalInventory,
      totalBookings: totalClubBookings + totalEventBookings,
    },
    loading,
    error
  }
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.id) {
          const { data: vendor, error } = await supabase
            .from('vendors')
            .select('role')
            .eq('id', user.id)
            .single()
          if (error) {
            setIsAdmin(false)
          } else {
            setIsAdmin(vendor?.role === 'admin')
          }
        } else {
          setIsAdmin(false)
        }
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    checkAdminStatus()
  }, [])

  return { isAdmin, loading }
}
