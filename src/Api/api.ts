import { authFetch } from '../../sdk/src/lib/authFetch'
import {
  getWalletTransactions,
  getNativeBalance as sdkGetNativeBalance,
  getTokenBalances as sdkGetTokenBalances,
  getWalletNFTs as sdkGetWalletNFTs,
} from '../../sdk/src/api/wallets'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/** ---- Types ---- */

export type WalletType = 'embedded' | 'smart' | 'external'

export interface CreateUserWalletResponse {
  token?: string
  userId?: string
  message?: string
}

export interface Wallet {
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

// ✅ NEW: Native balance
export interface NativeBalanceResponse {
  balance: string
}

// ✅ NEW: Token balances
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

// ✅ NEW: NFTs
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

/** ---- API Functions ---- */

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

  return apiFetch<FetchWalletsResponse>(`/wallets/user?${query}`, {
    method: 'GET',
  })
}

export async function deleteWallet(walletId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/wallets/${walletId}`, {
    method: 'DELETE',
  })
}

// Auth: Email Login
export async function loginWithEmail(email: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/email-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    console.error('Login failed:', errorBody)
    throw new Error(errorBody?.error || 'Email login failed')
  }

  const data = await res.json()
  return data as { token: string }
}

/** ---- User Profile APIs ---- */

export async function fetchUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/users/me', { method: 'GET' })
}

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
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update profile')
  }

  return res.json()
}

export async function deleteUserAccount(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/users/me', {
    method: 'DELETE',
  })
}

/** ---- Wallet Transaction APIs ---- */

export async function fetchWalletTransactions(
  walletAddress: string,
  _page = 1,
  _pageSize = 20
): Promise<FetchTransactionsResponse> {
  // No pagination in SDK call (adjust if SDK supports it)
  return getWalletTransactions(walletAddress)
}

/** ---- Wallet Asset APIs (NEW) ---- */

// ✅ Native balance (ETH, MATIC, etc.) — using SDK function
export async function fetchNativeBalance(
  walletAddress: string
): Promise<NativeBalanceResponse> {
  const balance = await sdkGetNativeBalance(walletAddress)
  return { balance }
}

// ✅ ERC-20 token balances — using SDK function
export async function fetchTokenBalances(
  walletAddress: string
): Promise<FetchTokensResponse> {
  const tokens = await sdkGetTokenBalances(walletAddress)
  return { tokens }
}

// ✅ NFTs (ERC-721 and ERC-1155) — using SDK function
export async function fetchNFTs(
  walletAddress: string
): Promise<FetchNFTsResponse> {
  const { erc721, erc1155 } = await sdkGetWalletNFTs(walletAddress)
  return { erc721, erc1155 }
}
