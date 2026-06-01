'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase, checkSupabaseConnection, isSupabaseConfigured } from './supabase'
import { mockDataService, initializeMockData } from './mock-data'

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isSeller: boolean
  storeName: string | null
  isSupabaseConnected: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, isSeller: boolean, storeName?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)
  const [storeName, setStoreName] = useState<string | null>(null)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false)

  useEffect(() => {
    initializeMockData()
    
    const initAuth = async () => {
      const connected = await checkSupabaseConnection()
      setIsSupabaseConnected(connected)

      if (connected && supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' })
          // Check if user is a seller
          const { data: profile } = await supabase
            .from('profiles')
            .select('store_name')
            .eq('id', session.user.id)
            .single()
          if (profile) {
            setIsSeller(true)
            setStoreName(profile.store_name)
          }
        }
      } else {
        // Use mock auth
        const mockSession = mockDataService.getSession()
        if (mockSession) {
          setUser(mockSession)
          const profile = mockDataService.getProfile(mockSession.id)
          if (profile) {
            setIsSeller(true)
            setStoreName(profile.store_name)
          }
        }
      }
      setIsLoading(false)
    }

    initAuth()

    // Listen for Supabase auth changes (only if configured)
    let subscription: { unsubscribe: () => void } | null = null
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' })
          if (supabase) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('store_name')
              .eq('id', session.user.id)
              .single()
            if (profile) {
              setIsSeller(true)
              setStoreName(profile.store_name)
            }
          }
        } else {
          setUser(null)
          setIsSeller(false)
          setStoreName(null)
        }
      })
      subscription = data.subscription
    }

    // Listen for mock auth changes
    const handleMockAuthChange = (event: CustomEvent) => {
      const mockUser = event.detail
      if (mockUser) {
        setUser(mockUser)
        const profile = mockDataService.getProfile(mockUser.id)
        if (profile) {
          setIsSeller(true)
          setStoreName(profile.store_name)
        }
      } else {
        setUser(null)
        setIsSeller(false)
        setStoreName(null)
      }
    }

    window.addEventListener('shreesasto_auth_change', handleMockAuthChange as EventListener)

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener('shreesasto_auth_change', handleMockAuthChange as EventListener)
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isSupabaseConnected && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return { error: null }
    } else {
      const user = mockDataService.authenticateUser(email, password)
      if (!user) return { error: 'Invalid email or password' }
      mockDataService.setSession(user)
      return { error: null }
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    wantsToBeSeller: boolean, 
    sellerStoreName?: string
  ): Promise<{ error: string | null }> => {
    if (isSupabaseConnected && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return { error: error.message }
      
      if (wantsToBeSeller && sellerStoreName && data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          store_name: sellerStoreName,
          email: email
        })
      }
      return { error: null }
    } else {
      // Check if user already exists
      const existingUsers = mockDataService.getUsers()
      if (existingUsers.some(u => u.email === email)) {
        return { error: 'An account with this email already exists' }
      }
      
      const newUser = mockDataService.createUser(email, password)
      
      if (wantsToBeSeller && sellerStoreName) {
        mockDataService.createProfile({
          id: newUser.id,
          store_name: sellerStoreName,
          email: email
        })
      }
      
      mockDataService.setSession(newUser)
      return { error: null }
    }
  }

  const signOut = async () => {
    if (isSupabaseConnected && supabase) {
      await supabase.auth.signOut()
    }
    mockDataService.setSession(null)
    setUser(null)
    setIsSeller(false)
    setStoreName(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isSeller,
      storeName,
      isSupabaseConnected,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
