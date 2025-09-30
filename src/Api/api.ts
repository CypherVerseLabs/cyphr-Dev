import { authFetch } from '../../sdk/src/lib/authFetch'
import {
  getWalletTransactions,
  getNativeBalance as sdkGetNativeBalance,
  getTokenBalances as sdkGetTokenBalances,
  getWalletNFTs as sdkGetWalletNFTs,
} from '../../sdk/src/api/wallets'
import { Key } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/** ---- Types ---- */

/**
 * Represents wallet categories.
 */
export type WalletType = 'embedded' | 'smart' | 'external'

/** ---- Data Interfaces ---- */

export interface CreateUserWalletResponse {
  token?: string
  userId?: string
  message?: string
}

export interface Wallet {
  balance: any
  address: Key | null | undefined
  label: any
  chainId: any
  metadata: any
  id: string
  walletAddress: string
  walletType: WalletType
  userEmail: string
  createdAt: string
}

export interface FetchWalletsResponse {
  wallets: Wallet[]
}

export interface UserProfile {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
}

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  status: string
}

export interface FetchTransactionsResponse {
  transactions: Transaction[]
  total: number
}

export interface NativeBalanceResponse {
  balance: string
}

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  contractAddress: string
  decimals: number
}

export interface FetchTokensResponse {
  tokens: TokenBalance[]
}

export interface NFTItem {
  contractAddress: string
  tokenId: string
  tokenURI: string
  metadata?: any
}

export interface FetchNFTsResponse {
  erc721: NFTItem[]
  erc1155: NFTItem[]
}

/** ---- Generic Authenticated API Helper ---- */

/**
 * Helper for authenticated API calls with JSON content-type.
 * Automatically adds auth headers via authFetch.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  return authFetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }) as Promise<T>
}

/** ---- Admin APIs ---- */

/**
 * Refresh ENS names for all wallets (Admin only).
 * Returns count of refreshed wallets.
 */
export async function refreshAllENSNames(): Promise<{ refreshed: number }> {
  return apiFetch<{ refreshed: number }>('/admin/refresh-ens-all', {
    method: 'POST',
  })
}

/** ---- User Authentication ---- */

/**
 * Login using email.
 * Returns an authentication token on success.
 */
export async function loginWithEmail(email: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/email-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    console.error('Login failed:', errorBody)
    throw new Error(errorBody?.error || 'Email login failed')
  }

  return res.json()
}

/** ---- User Profile APIs ---- */

/**
 * Fetch currently authenticated user profile.
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me', { method: 'GET' })
}

/**
 * Update user profile.
 * Supports displayName, email, and avatar file upload.
 */
export async function updateUserProfile(data: {
  displayName?: string
  email?: string
  avatarFile?: File
}): Promise<UserProfile> {
  const formData = new FormData()
  if (data.displayName) formData.append('displayName', data.displayName)
  if (data.email) formData.append('email', data.email)
  if (data.avatarFile) formData.append('avatar', data.avatarFile)

  const url = `${API_BASE_URL}/users/me`
  const token = localStorage.getItem('authToken')

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update profile')
  }

  return res.json()
}

/**
 * Delete the authenticated user's account.
 */
export async function deleteUserAccount(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/users/me', { method: 'DELETE' })
}

/** ---- Wallet Management APIs ---- */

/**
 * Create a new user wallet with email, wallet address and wallet type.
 */
export async function createUserWallet(
  email: string,
  walletAddress: string,
  walletType: WalletType
): Promise<CreateUserWalletResponse> {
  return apiFetch<CreateUserWalletResponse>('/users', {
    method: 'POST',
    body: JSON.stringify({ email, walletAddress, walletType }),
  })
}

/**
 * Fetch wallets for the current user with optional pagination and filtering.
 */
export async function fetchWallets(
  page = 1,
  pageSize = 10,
  filterType?: WalletType
): Promise<FetchWalletsResponse> {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filterType ? { walletType: filterType } : {}),
  }).toString()

  return apiFetch<FetchWalletsResponse>(`/wallets/user?${query}`, { method: 'GET' })
}

/**
 * Update a wallet by ID.
 */
export async function updateWallet(walletId: string, updates: Partial<Wallet>): Promise<Wallet> {
  return apiFetch<Wallet>(`/wallets/${walletId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

/**
 * Delete a wallet by ID.
 */
export async function deleteWallet(walletId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/wallets/${walletId}`, { method: 'DELETE' })
}

/** ---- Wallet Transactions ---- */

/**
 * Fetch wallet transactions.
 * Note: Currently SDK call does not support pagination.
 */
export async function fetchWalletTransactions(
  walletAddress: string,
  _page = 1,
  _pageSize = 20
): Promise<FetchTransactionsResponse> {
  const sdkTransactions = await getWalletTransactions(walletAddress)

  const transactions: Transaction[] = sdkTransactions.map((tx) => ({
    ...tx,
    timestamp: tx.timestamp.toString(), // Fix: Convert number → string
  }))

  return {
    transactions,
    total: transactions.length,
  }
}

/** ---- Wallet Asset APIs (using SDK) ---- */

/**
 * Fetch native cryptocurrency balance (ETH, MATIC, etc.).
 */
export async function fetchNativeBalance(
  walletAddress: string
): Promise<NativeBalanceResponse> {
  const result = await sdkGetNativeBalance(walletAddress)
  return { balance: result.balance } // Assuming 'result' is { balance: string }
}

/**
 * Fetch ERC-20 token balances.
 */
export async function fetchTokenBalances(
  walletAddress: string
): Promise<FetchTokensResponse> {
  const sdkTokens = await sdkGetTokenBalances(walletAddress)

  const tokens: TokenBalance[] = sdkTokens.map((token) => ({
    ...token,
    contractAddress: token.tokenAddress, // Fix
  }))

  return { tokens }
}

/**
 * Fetch NFTs (ERC-721 and ERC-1155) owned by the wallet.
 */
export async function fetchNFTs(
  walletAddress: string
): Promise<FetchNFTsResponse> {
  const sdkNFTs = await sdkGetWalletNFTs(walletAddress)

  const nftItems: NFTItem[] = sdkNFTs.map((nft) => ({
    ...nft,
    tokenURI: nft.metadata?.tokenURI || '', // Fix: Use real value if available, or fallback
  }))

  return {
    erc721: nftItems,
    erc1155: [],
  }
}