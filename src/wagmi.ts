import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { baseAccount, injected, walletConnect } from 'wagmi/connectors'
import { cyphChain } from '../sdk/src/chains/cyphChain'

// ✅ Load project ID from env
const projectId = import.meta.env.VITE_WC_PROJECT_ID

// ✅ Warn if not set
if (!projectId) {
  throw new Error('Missing VITE_WC_PROJECT_ID in environment variables.')
}

export const config = createConfig({
  chains: [mainnet, sepolia, cyphChain] as const, // ✅ FIXED: now a tuple
  connectors: [
    injected(),
    baseAccount(),
    walletConnect({ projectId }), // ✅ Use safe projectId
  ],
  transports: {
    [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    [sepolia.id]: http(sepolia.rpcUrls.default.http[0]),
    [cyphChain.id]: http(cyphChain.rpcUrls.default.http[0]),
  },
})


