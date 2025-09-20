import { useEffect, useState } from 'react'
import { Connector } from 'wagmi'

export function useWalletProviderReady(connector: Connector) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    connector
      .getProvider?.()
      .then((provider) => {
        if (!cancelled) {
          setReady(!!provider)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [connector])

  return { ready, loading }
}
