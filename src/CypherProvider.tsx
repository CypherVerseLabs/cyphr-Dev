'use client'

import React, { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'
import { SecretKeyContext } from '../sdk/src/contexts/SecretKeyContext'
import { createCypherConfig } from '../sdk/src/lib/config'

type CypherProviderProps = {
  children: React.ReactNode
  initialState?: State
  projectId?: string
  secretKey?: string
  rpcUrl?: string
}

export function CyphrProvider({
  children,
  initialState,
  projectId,
  secretKey,
  rpcUrl = 'http://localhost:8545',
}: CypherProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  const effectiveProjectId =
    projectId || import.meta.env.VITE_WC_PROJECT_ID || ''

  const effectiveRpcUrl =
    rpcUrl || import.meta.env.VITE_RPC_URL || 'http://localhost:8545'

  if (!effectiveProjectId && import.meta.env.DEV) {
    console.warn(
      '[Cypher SDK] WalletConnect Project ID is missing. Provide it via prop or env.'
    )
  }

  if (!secretKey && import.meta.env.DEV) {
    console.warn('[Cypher SDK] Secret key is missing. Some APIs may fail.')
  }

  const wagmiConfig = useMemo(() => {
    return createCypherConfig({
      projectId: effectiveProjectId,
      rpcUrl: effectiveRpcUrl,
    })
  }, [effectiveProjectId, effectiveRpcUrl])

  return (
    <SecretKeyContext.Provider value={secretKey}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </SecretKeyContext.Provider>
  )
}
