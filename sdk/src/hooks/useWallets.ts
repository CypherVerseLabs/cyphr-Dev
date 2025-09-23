// src/hooks/useWallets.ts

import { useEffect, useState, useCallback } from 'react'
import {
  fetchWallets as fetchWalletsAPI,
  createUserWallet,
  updateWallet as updateWalletAPI,
  deleteWallet as deleteWalletAPI,
  Wallet,
} from '../../../src/Api/api'

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    try {
      const { wallets } = await fetchWalletsAPI()
      setWallets(wallets)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch wallets')
    } finally {
      setLoading(false)
    }
  }, [])

  const addWallet = useCallback(async (wallet: Partial<Wallet>) => {
    const { userEmail, walletAddress, walletType } = wallet
    if (!userEmail || !walletAddress || !walletType)
      throw new Error('Missing required wallet fields')

    const result = await createUserWallet(userEmail, walletAddress, walletType)
    setWallets((prev) => [...prev, { ...wallet, ...result } as Wallet])
  }, [])

  const updateWallet = useCallback(async (walletId: string, updates: Partial<Wallet>) => {
    const updated = await updateWalletAPI(walletId, updates)
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? updated : w))
    )
  }, [])

  const deleteWallet = useCallback(async (walletId: string) => {
    await deleteWalletAPI(walletId)
    setWallets((prev) => prev.filter((w) => w.id !== walletId))
  }, [])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  return {
    wallets,
    loading,
    error,
    refetch: fetchWallets,
    addWallet,
    updateWallet,
    deleteWallet,
  }
}
