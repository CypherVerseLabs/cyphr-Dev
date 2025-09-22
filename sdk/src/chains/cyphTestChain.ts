import { Chain } from 'viem/chains'

const LOCAL_RPC = process.env.NEXT_PUBLIC_CYPH_RPC_URL || 'http://192.168.1.79:8545'

export const cyphChain: Chain = {
  id: 515051,
  name: 'CYPH Local Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Cypher',
    symbol: 'CYPH',
  },
  rpcUrls: {
    default: {
      http: [LOCAL_RPC],
    },
    public: {
      http: [LOCAL_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local Explorer',
      url: 'http://192.168.1.79:8000', // optional
    },
  },
  testnet: true,
} as const
