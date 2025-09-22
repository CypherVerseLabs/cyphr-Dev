import { useEffect, useState, useCallback } from 'react'
import { authFetch } from '../../../src/lib/authFetch'

export type WalletType = 'embedded' | 'smart' | 'external'

export interface Wallet {
  [x: string]: any
  id: string
  walletAddress: string
  walletType: WalletType
  userEmail: string
  createdAt: string
  metadata?: any
}

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/wallets/user', { method: 'GET' })
      if (!res.ok) throw new Error('Failed to fetch wallets')
      const data = await res.json()
      setWallets(data.wallets || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wallets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addWallet = useCallback(async (wallet: Partial<Wallet>) => {
    const res = await authFetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallet),
    })
    if (!res.ok) throw new Error('Failed to add wallet')
    const newWallet = await res.json()
    setWallets((prev) => [...prev, newWallet])
  }, [])

  const updateWallet = useCallback(
    async (walletId: string, updates: Partial<Wallet>) => {
      const res = await authFetch(`/api/wallets/${walletId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update wallet')
      const updated = await res.json()
      setWallets((prev) =>
        prev.map((w) => (w.id === walletId ? updated : w))
      )
    },
    []
  )

  const deleteWallet = useCallback(async (walletId: string) => {
    const res = await authFetch(`/api/wallets/${walletId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete wallet')
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
