// sdk/src/api/wallets.ts

import { authFetch, setClientId as setWalletClientId } from '../lib/authFetch'

/** Set client ID for authenticated requests */
export function setClientId(id: string | undefined) {
  setWalletClientId(id)
}

// --------------------
// Types
// --------------------

export interface WalletTransaction {
  hash: string
  timestamp: number
  from: string
  to: string
  value: string
  asset?: string
  status: 'pending' | 'confirmed' | 'failed'
}

export interface NativeBalance {
  balance: string // usually in wei (you can convert it with ethers.utils.formatEther)
}

export interface TokenBalance {
  tokenAddress: string
  symbol: string
  name: string
  balance: string
  decimals: number
}

export interface NFT {
  contractAddress: string
  tokenId: string
  image: string
  name: string
  description?: string
  metadata?: Record<string, any>
}

// --------------------
// API Functions
// --------------------

/**
 * Get wallet transactions with optional pagination
 */
export async function getWalletTransactions(
  address: string,
  options?: { limit?: number; offset?: number }
): Promise<WalletTransaction[]> {
  const query = new URLSearchParams(options as any).toString()
  const url = `/wallets/${address}/transactions${query ? `?${query}` : ''}`
  return authFetch(url)
}

/**
 * Get native currency balance (e.g., ETH, MATIC)
 */
export async function getNativeBalance(address: string): Promise<NativeBalance> {
  return authFetch(`/native/${address}`)
}

/**
 * Get all ERC-20 token balances for a wallet
 */
export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
  return authFetch(`/tokens/${address}`)
}

/**
 * Get NFTs owned by a wallet
 */
export async function getWalletNFTs(address: string): Promise<NFT[]> {
  return authFetch(`/nfts/${address}`)
}
