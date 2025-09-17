'use client'

import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'

import { createCypherConfig } from '../lib/config' // ✅ Correct import

type Props = {
  children: React.ReactNode,
  initialState: State | undefined,
}

export function CypherProvider({ children, initialState }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  const projectId = import.meta.env.VITE_WC_PROJECT_ID
  const rpcUrl = import.meta.env.VITE_RPC_URL || 'http://localhost:8545'

  if (!projectId) {
    throw new Error('VITE_WC_PROJECT_ID is missing in your .env')
  }

  const wagmiConfig = createCypherConfig({
    projectId,
    rpcUrl,
  })

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
