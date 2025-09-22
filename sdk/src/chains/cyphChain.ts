import { Chain } from 'viem/chains';

export const cyphChain: Chain = {
  id: 5150,
  name: 'CYPH Local Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Cypher',
    symbol: 'CYPH',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL ?? 'http://localhost:8545'],
    },
  },
  testnet: false,
} as const;
