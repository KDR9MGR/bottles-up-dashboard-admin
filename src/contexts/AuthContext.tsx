import React, { createContext, useEffect, useState } from 'react'
import { User, Session, AuthError, PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  isAdmin: boolean
  checkUserAdminStatus: (userId: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
    return await new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('Query timeout')), ms)
      promise
        .then((value) => {
          clearTimeout(timeoutId)
          resolve(value)
        })
        .catch((error) => {
          clearTimeout(timeoutId)
          reject(error)
        })
    })
  }

  const getUserName = (u: User) => {
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>
    const metaName = meta['name']
    if (typeof metaName === 'string' && metaName.trim()) return metaName
    return u.email?.split('@')[0] || 'User'
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔄 Getting initial session...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          setSession(null)
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
        } else {
          console.log('📋 Initial session:', session ? 'Found' : 'None')
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            console.log('👤 User found, checking admin status...')
            await checkAdminStatus(session?.user)
          } else {
            console.log('❌ No user, setting loading to false')
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change:', event, session ? 'Session exists' : 'No session')
        try {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            console.log('👤 User in auth change, checking admin status...')
            await checkAdminStatus(session?.user)
          } else {
            console.log('❌ No user in auth change, resetting states')
            setIsAdmin(false)
            setLoading(false)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const safeVendorUpsert = async (u: User) => {
    const payload = {
      id: u.id,
      email: u.email,
      name: getUserName(u),
    }
    const { error: upsertError } = await supabase
      .from('vendors')
      .upsert(payload, { onConflict: 'id' })
    if (upsertError) {
      console.error('Error upserting vendor:', upsertError)
      return false
    }
    return true
  }

  const recheckVendorRole = async (u: User) => {
    const { data, error } = await supabase
      .from('vendors')
      .select('role')
      .eq('id', u.id)
      .single()
    if (error) {
      console.error('Re-check admin status failed:', error)
      return false
    }
    return data?.role === 'admin'
  }

  const shouldAttemptUpsert = (err: PostgrestError | null | undefined) => {
    if (!err) return false
    // PGRST116: No rows, 42501: permission denied, 406/403 variants, treat 500 as retriable
    const errObj = err as unknown as { code?: unknown; status?: unknown }
    const code = typeof errObj.code === 'string' ? errObj.code : undefined
    const status = typeof errObj.status === 'number' ? errObj.status : undefined
    const should = (
      code === 'PGRST116' ||
      code === '42501' ||
      code === 'PGRST301' || // permission check failed
      status === 403 ||
      status === 406 ||
      status === 500
    )
    if (should) {
      console.warn('Admin check error considered retriable via upsert:', { code, status, err })
    }
    return should
  }

  const checkAdminStatus = async (user: User) => {
    try {
      console.log('🔍 Checking admin status for user:', user?.id)
      if (user?.id) {
        try {
          console.log('📡 Making Supabase query...')
          
          // Add timeout to prevent hanging queries
          const queryPromise = supabase
            .from('vendors')
            .select('role')
            .eq('id', user.id)
            .single<{ role: string | null }>()

          const { data, error } = await withTimeout(queryPromise, 10000)
          console.log('📡 Supabase query completed:', { data, error })
        
        if (error) {
          console.log('⚠️ Error in admin check:', error)
          if (shouldAttemptUpsert(error)) {
            // Try to create or ensure the vendor row exists for this user, then re-check
            console.log('🔄 Attempting vendor upsert...')
            const ok = await safeVendorUpsert(user)
            if (ok) {
              const isAdminNow = await recheckVendorRole(user)
              console.log('✅ Admin status after upsert:', isAdminNow)
              setIsAdmin(isAdminNow)
            } else {
              console.log('❌ Upsert failed, setting admin to false')
              setIsAdmin(false)
            }
          } else {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          }
        } else {
          const adminStatus = data?.role === 'admin';
          console.log('✅ Admin status retrieved:', adminStatus)
          setIsAdmin(adminStatus);
        }
        } catch (error) {
          console.error('Error in checkAdminStatus:', error);
          setIsAdmin(false);
        }
      } else {
        console.log('❌ No user ID, setting admin to false')
        setIsAdmin(false)
      }
    } catch (outerError) {
      console.error('🚨 Outer error in checkAdminStatus:', outerError);
      setIsAdmin(false);
    } finally {
      console.log('🏁 Setting loading to false')
      setLoading(false);
    }
  }

  const checkUserAdminStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      // Proactively refresh session and trigger admin check to avoid race conditions
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user
      if (u) {
        await checkAdminStatus(u)
      }
    }
    return { error }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    checkUserAdminStatus,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
