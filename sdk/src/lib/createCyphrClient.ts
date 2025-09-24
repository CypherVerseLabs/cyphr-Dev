// sdk/src/lib/createCyphrClient.ts

import * as userApi from '../api/users'
import * as walletApi from '../api/wallets'

export type CyphrClientConfig = {
  getWalletAddress?: () => string | undefined
  getAuthToken?: () => string | undefined
}

export function createCyphrClient(config: CyphrClientConfig = {}) {
  const getWalletAddress = () => {
    const address = config.getWalletAddress?.()
    if (!address) throw new Error('[CypherClient] Wallet address is not available')
    return address
  }

  const getAuthToken = () => {
    const token = config.getAuthToken?.()
    if (!token) throw new Error('[CypherClient] Auth token is not available')
    return token
  }

  return {
    users: {
      fetchProfile: async () => {
        getAuthToken() // Enforce auth for user-related calls
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
