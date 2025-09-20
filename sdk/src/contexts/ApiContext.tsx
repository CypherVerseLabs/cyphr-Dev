// src/context/ApiContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useWallets } from '../hooks/useWallets'
import { fetchUserProfile, UserProfile } from '../api'
import type { Wallet } from '../types/types'

interface ApiContextValue {
  user?: UserProfile
  loadingUser: boolean
  userError?: string
  wallets: Wallet[]
  walletsLoading: boolean
  walletsError?: string
  refreshUser: () => Promise<void>
  refreshWallets: () => Promise<void>
  addWallet: (wallet: Partial<Wallet>) => Promise<void>
  updateWallet: (walletId: string, updates: Partial<Wallet>) => Promise<void>
  deleteWallet: (walletId: string) => Promise<void>
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined)

export function ApiProvider({ children }: { children: React.ReactNode }) {
  // User state
  const [user, setUser] = useState<UserProfile | undefined>()
  const [loadingUser, setLoadingUser] = useState(true)
  const [userError, setUserError] = useState<string | undefined>()

  // Wallets state from hook
  const {
    wallets,
    loading: walletsLoading,
    error: walletsErrorRaw,
    refetch: refetchWallets,
    addWallet,
    updateWallet,
    deleteWallet,
  } = useWallets()

  // Normalize wallets error type (string | null) to string | undefined
  const walletsError = walletsErrorRaw ?? undefined

  // Fetch user profile function
  async function fetchAndSetUser() {
    setLoadingUser(true)
    setUserError(undefined)
    try {
      const userProfile = await fetchUserProfile()
      setUser(userProfile)
    } catch (err) {
      setUserError(err instanceof Error ? err.message : 'Failed to load user')
      setUser(undefined)
    } finally {
      setLoadingUser(false)
    }
  }

  // Fetch user on mount
  useEffect(() => {
    fetchAndSetUser()
  }, [])

  return (
    <ApiContext.Provider
      value={{
        user,
        loadingUser,
        userError,
        wallets,
        walletsLoading,
        walletsError,
        refreshUser: fetchAndSetUser,
        refreshWallets: refetchWallets,
        addWallet,
        updateWallet,
        deleteWallet,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}
