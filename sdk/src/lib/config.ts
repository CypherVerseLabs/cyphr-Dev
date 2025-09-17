// sdk/lib/config.ts

import { createConfig, http, cookieStorage, createStorage } from 'wagmi'
import { injected, walletConnect, baseAccount } from 'wagmi/connectors'
import { Chain } from 'viem' // for typing

interface CypherSDKConfigOptions {
  projectId: string
  rpcUrl?: string
  chains?: Chain[]
}

export function createCypherConfig({
  projectId,
  rpcUrl = 'http://localhost:8545',
  chains = [],
}: CypherSDKConfigOptions) {
  if (!projectId) {
    throw new Error('WalletConnect projectId is required')
  }

  const defaultChain = {
    id: 5150,
    name: 'Cyph Local',
    nativeCurrency: { name: 'CYPH', symbol: 'CYPH', decimals: 18 },
    rpcUrls: {
      default: { http: [rpcUrl] },
      public: { http: [rpcUrl] },
    },
  }

  const wagmiChains = chains.length ? chains : [defaultChain]

  return createConfig({
    chains: wagmiChains as [Chain, ...Chain[]], // cast as required tuple
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    connectors: [
      injected(),
      baseAccount(),
      walletConnect({ projectId }),
    ],
    transports: Object.fromEntries(
      wagmiChains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
    ),
  })
}
