// config.ts

import {
  createConfig,
  http,
  cookieStorage,
  createStorage,
} from 'wagmi'

import { custom } from 'viem' // ✅ This is the correct helper
import { mainnet, sepolia } from 'wagmi/chains'
import { cyphChain } from '../../sdk/src/chains/cyphChain'
import { customRpc } from '../../sdk/src/rpc' // Your customRpc from earlier

export const config = createConfig({
  chains: [mainnet, sepolia, cyphChain],

  ssr: true,

  storage: createStorage({
    storage: cookieStorage,
  }),

  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),

    // ✅ Use `viem`'s custom() helper to wrap your RPC
    [cyphChain.id]: custom({
      request: ({ method, params }) =>
        customRpc.request({ method, params }),
    }),
  },
})
