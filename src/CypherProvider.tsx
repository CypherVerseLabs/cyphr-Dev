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

// Cache wagmiConfig globally to prevent multiple WalletConnect Core initializations
let cachedWagmiConfig: ReturnType<typeof createCypherConfig> | null = null

function getWagmiConfig(projectId: string, rpcUrl: string) {
  if (!cachedWagmiConfig) {
    cachedWagmiConfig = createCypherConfig({
      projectId,
      rpcUrl,
    })
  }
  return cachedWagmiConfig
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

  const effectiveSecretKey = secretKey || import.meta.env.VITE_CYPHER_SECRET_KEY || ''

  if (!effectiveProjectId && import.meta.env.DEV) {
    console.warn(
      '[Cypher SDK] WalletConnect Project ID is missing. Provide it via prop or env.'
    )
  }

  if (!effectiveSecretKey && import.meta.env.DEV) {
    console.warn('[Cypher SDK] Secret key is missing. Some APIs may fail.')
  }

  // Use cached wagmiConfig so WalletConnect Core init happens once
  const wagmiConfig = useMemo(() => {
    return getWagmiConfig(effectiveProjectId, effectiveRpcUrl)
  }, [effectiveProjectId, effectiveRpcUrl])

  return (
    <SecretKeyContext.Provider value={effectiveSecretKey}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </SecretKeyContext.Provider>
  )
}
