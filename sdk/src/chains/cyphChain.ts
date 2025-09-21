import { Chain } from 'viem/chains'

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
      http: ['http://192.168.1.79:8545'],
    },
  },
  testnet: false,
 }as const
