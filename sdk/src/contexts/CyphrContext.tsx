// sdk/src/contexts/CyphrContext.tsx

import { createContext, useContext } from 'react'
import { createCyphrClient } from '../lib/createCyphrClient'
import { useAccount } from 'wagmi'

const CyphrContext = createContext<ReturnType<typeof createCyphrClient> | null>(null)

export function useCyphr() {
  const ctx = useContext(CyphrContext)
  if (!ctx) throw new Error('useCyphr must be used inside a <CyphrProvider>')
  return ctx
}

export function CyphrProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount()

  const client = createCyphrClient({
    getWalletAddress: () => address,
    getAuthToken: () => localStorage.getItem('authToken') ?? undefined, // ✅ Fix here
  })

  return (
    <CyphrContext.Provider value={client}>
      {children}
    </CyphrContext.Provider>
  )
}
