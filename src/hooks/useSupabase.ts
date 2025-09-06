import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile, Vendor, Club, Event } from '../types/supabase'

// Generic hook for fetching data with count
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
        
        if (fetchError) {
          throw fetchError
        }
        
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

// Hook for fetching profiles (users)
export function useProfiles() {
  return useSupabaseData<Profile>('profiles')
}

// Hook for fetching vendors
export function useVendors() {
  return useSupabaseData<Vendor>('vendors')
}

// Hook for fetching clubs
export function useClubs() {
  return useSupabaseData<Club>('clubs')
}

// Hook for fetching events
export function useEvents() {
  return useSupabaseData<Event>('events')
}

// Hook for getting dashboard stats
export function useDashboardStats() {
  const { count: totalUsers, loading: usersLoading, error: usersError } = useProfiles()
  const { count: totalVendors, loading: vendorsLoading, error: vendorsError } = useVendors()
  const { count: totalClubs, loading: clubsLoading, error: clubsError } = useClubs()
  const { count: totalEvents, loading: eventsLoading, error: eventsError } = useEvents()

  const loading = usersLoading || vendorsLoading || clubsLoading || eventsLoading
  const error = usersError || vendorsError || clubsError || eventsError

  return {
    stats: {
      totalUsers,
      totalVendors,
      totalClubs,
      totalEvents
    },
    loading,
    error
  }
}

// Hook for checking if user is admin
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user?.id) {
          // Check admin status from vendors table
          const { data: vendor, error } = await supabase
            .from('vendors')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (error) {
            console.error('Error fetching vendor:', error)
            setIsAdmin(false)
          } else {
            setIsAdmin(vendor?.role === 'admin')
          }
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [])

  return { isAdmin, loading }
}