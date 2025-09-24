// src/lib/createCyphrClient.ts

import * as userApi from '../api/users'
import * as walletApi from '../api/wallets'

export type CyphrClientConfig = {
  clientId?: string
  getWalletAddress?: () => string | undefined
  getAuthToken?: () => string | undefined
}

export function createCyphrClient(config: CyphrClientConfig = {}) {
  // Set clientId in api modules for header injection
  userApi.setClientId(config.clientId)
  walletApi.setClientId(config.clientId)

  const getWalletAddress = () => {
    const address = config.getWalletAddress?.()
    if (!address) throw new Error('[CyphrClient] Wallet address is not available')
    return address
  }

  const getAuthToken = () => {
    const token = config.getAuthToken?.()
    if (!token) throw new Error('[CyphrClient] Auth token is not available')
    return token
  }

  return {
    users: {
      fetchProfile: async () => {
        getAuthToken() // Enforce auth token presence
        return userApi.fetchUserProfile()
      },
    },
    wallets: {
      getNativeBalance: () => {
        const address = getWalletAddress()
        return walletApi.getNativeBalance(address)
      },
      getTokenBalances: () => {
        const address = getWalletAddress()
        return walletApi.getTokenBalances(address)
      },
      getWalletNFTs: () => {
        const address = getWalletAddress()
        return walletApi.getWalletNFTs(address)
      },
      getWalletTransactions: () => {
        const address = getWalletAddress()
        return walletApi.getWalletTransactions(address)
      },
    },
  }
}
