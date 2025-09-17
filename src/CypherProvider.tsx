'use client'  // THIS LINE MUST BE AT THE VERY TOP

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { config } from '../src/lib/config' // ✅ corrected import

type Props = {
  children: ReactNode,
  initialState: State | undefined,
}

export function CypherProvider({ children, initialState }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
