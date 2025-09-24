// sdk/src/hooks/useNativeBalance.ts
import { useState, useEffect } from 'react'
import { useCyphr } from '../../sdk/src/contexts/CyphrContext'

export function useNativeBalance() {
  const cyphr = useCyphr()
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const address = cyphr?.wallets?.getNativeBalance

    if (!address) return

    const fetchBalance = async () => {
      setLoading(true)
      try {
        const result = await cyphr.wallets.getNativeBalance()
        setBalance(result.balance || null)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch native balance')
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [cyphr])

  return { balance, loading, error }
}
