// config.ts

import {
  createConfig,
  http,
  cookieStorage,
  createStorage,
} from 'wagmi'

import { mainnet, sepolia } from 'wagmi/chains'
import { cyphChain } from '../../sdk/src/chains/cyphChain'

export const config = createConfig({
  chains: [mainnet, sepolia, cyphChain],  // Include your custom Cyph local chain
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [cyphChain.id]: http('http://192.168.1.79:8545'),  // Cyph RPC node
  },
})