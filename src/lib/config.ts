import { Chain } from 'viem'

export const cyphChain: Chain = {
  id: 5150,
  name: 'CyphNode',
  nativeCurrency: {
    name: 'CYPH',
    symbol: 'CYPH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://192.168.1.79:8545'],
    },
    public: {
      http: ['http://192.168.1.79:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Cyph Explorer',
      url: 'http://192.168.1.79:8545',
    },
  },
  testnet: false,
}
