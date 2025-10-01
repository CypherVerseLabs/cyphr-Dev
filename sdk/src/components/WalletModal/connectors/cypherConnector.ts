import { createConnector } from 'wagmi'
import { Chain } from 'viem'
import { JsonRpcProvider } from 'ethers'       // <-- updated import here
import { CypherNode } from '../../../rpc/cypherNode'

export const cyphChain: Chain = {
  id: 5150,
  name: 'CYPH Local Chain',
  nativeCurrency: {
    name: 'Cypher',
    symbol: 'CYPH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  testnet: false,
} as const

export const cypherConnector = createConnector(() => ({
  id: 'cypher',
  name: 'Cypher Node',
  type: 'custom',

  connect: async () => {
    const accounts = await CypherNode.request({ method: 'eth_requestAccounts' })
    return {
      accounts,
      chainId: cyphChain.id,
    }
  },

  disconnect: async () => {},

  getAccount: async () => {
    const accounts = await CypherNode.request({ method: 'eth_accounts' })
    return accounts[0]
  },

  getAccounts: async () => {
    const accounts = await CypherNode.request({ method: 'eth_accounts' })
    return accounts
  },

  isAuthorized: async () => {
    const accounts = await CypherNode.request({ method: 'eth_accounts' })
    return accounts.length > 0
  },

  getChainId: async () => cyphChain.id,

  getProvider: async () => new JsonRpcProvider(cyphChain.rpcUrls.default.http[0]),

  // Change these to simple callbacks that take the data directly:
  onAccountsChanged: (_accounts: string[]) => {
    // handle accounts change here
  },

  onChainChanged: (_chainId: string) => {
  // optionally log or handle
},

  onDisconnect: () => {
    // handle disconnect here
  },
}))
