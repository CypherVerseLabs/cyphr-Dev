'use client'

import React, { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'
import { SecretKeyContext } from '../contexts/SecretKeyContext'
import { createCypherConfig } from '../lib/config'

type CyphrClient = {
  children: React.ReactNode
  initialState?: State
  projectId?: string
  secretKey?: string
  rpcUrl?: string
}

export function CypherProvider({
  children,
  initialState,
  projectId,
  secretKey,
  rpcUrl = 'http://localhost:8545',
}: CyphrClient) {
  const [queryClient] = useState(() => new QueryClient())

  const effectiveProjectId =
    projectId || process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

  const effectiveRpcUrl =
    rpcUrl || process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'

  if (!effectiveProjectId && process.env.NODE_ENV === 'development') {
    console.warn(
      '[Cypher SDK] WalletConnect Project ID is missing. Provide it via prop or env.'
    )
  }

  if (!secretKey && process.env.NODE_ENV === 'development') {
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
