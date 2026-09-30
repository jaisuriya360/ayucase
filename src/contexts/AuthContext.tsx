import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthUser, UserRole } from '../types/auth'
import { DEMO_PATIENT_PROFILES, DEMO_PHYSICIAN_PROFILES } from '../data/mockProfiles'

interface AuthContextType {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  loginAsPatient: (profileId?: string) => Promise<AuthUser>
  registerPatient: (data: {
    name: string
    age: number
    gender: string
    condition: string
  }) => Promise<AuthUser>
  loginAsPhysician: (profileId?: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_KEY = 'ayucase_auth_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser
        setUser(parsed)
      }
    } catch (e) {
      console.error('Failed to parse auth user', e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistUser = (authUser: AuthUser | null) => {
    setUser(authUser)
    if (authUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser))
    } else {
      localStorage.removeItem(AUTH_USER_KEY)
    }
  }

  const loginAsPatient = async (profileId: string = 'demo-pt-1'): Promise<AuthUser> => {
    setIsLoading(true)
    // Simulate brief asynchronous clinical verification
    await new Promise((resolve) => setTimeout(resolve, 300))

    const found = DEMO_PATIENT_PROFILES.find((p) => p.id === profileId) || DEMO_PATIENT_PROFILES[0]
    const authUser: AuthUser = {
      id: found.id,
      role: 'patient',
      name: found.name,
      email: found.email,
      fictionalIdentifier: found.fictionalIdentifier,
      phoneMasked: '+91 9840X-XXXX1',
      abhaDemoId: `demo.${found.id}@sbx`,
    }

    persistUser(authUser)
    setIsLoading(false)
    return authUser
  }

  const registerPatient = async (data: {
    name: string
    age: number
    gender: string
    condition: string
  }): Promise<AuthUser> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 350))

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newId = `demo-pt-${randomSuffix}`

    const authUser: AuthUser = {
      id: newId,
      role: 'patient',
      name: data.name || 'New Demo Patient',
      email: `${data.name.toLowerCase().replace(/\s+/g, '.') || 'patient'}@ayucase.local`,
      fictionalIdentifier: `PT-DEMO-${randomSuffix}`,
      phoneMasked: '+91 9876X-XXXX5',
      abhaDemoId: `demo.${newId}@sbx`,
    }

    persistUser(authUser)
    setIsLoading(false)
    return authUser
  }

  const loginAsPhysician = async (profileId: string = 'demo-md-1'): Promise<AuthUser> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    const found = DEMO_PHYSICIAN_PROFILES.find((p) => p.id === profileId) || DEMO_PHYSICIAN_PROFILES[0]
    const authUser: AuthUser = {
      id: found.id,
      role: 'physician',
      name: found.name,
      email: found.email,
      fictionalIdentifier: found.fictionalIdentifier,
      phoneMasked: '+91 9444X-XXXX0',
    }

    persistUser(authUser)
    setIsLoading(false)
    return authUser
  }

  const logout = () => {
    persistUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        loginAsPatient,
        registerPatient,
        loginAsPhysician,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
