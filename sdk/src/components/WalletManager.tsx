import { useAccount, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createUserWallet,
  fetchWallets,
  deleteWallet,
  WalletType,
} from '../../../src/Api/api'

import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

// 📌 Helper for consistent query key
function getWalletsQueryKey(
  filterType: WalletType | '',
  page: number
) {
  return ['wallets', filterType || 'all', page]
}

export default function WalletManager() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { token, saveToken, clearToken } = useAuth()

  const [email, setEmail] = useState('')
  const [walletType, setWalletType] = useState<WalletType>('embedded')
  const [filterType, setFilterType] = useState<WalletType | ''>('')
  const [page, setPage] = useState(1)
  const pageSize = 5

  // 🛠️ Mutation: Create Wallet
  const createWalletMutation = useMutation({
    mutationFn: async ({
      email,
      walletAddress,
      walletType,
    }: {
      email: string
      walletAddress: string
      walletType: WalletType
    }) => {
      const response = await createUserWallet(email, walletAddress, walletType)
      if (response.token) {
        saveToken(response.token)
      }
      return response
    },
    onSuccess: () => {
      toast.success('✅ Wallet synced successfully!')
      queryClient.invalidateQueries({
        queryKey: getWalletsQueryKey(filterType, page),
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? `❌ ${error.message}`
          : '❌ Failed to sync wallet'
      )
    },
  })

  // 🗑️ Mutation: Delete Wallet
  const deleteMutation = useMutation({
    mutationFn: (walletId: string) => deleteWallet(walletId),
    onSuccess: () => {
      toast.success('🗑️ Wallet deleted')
      queryClient.invalidateQueries({
        queryKey: getWalletsQueryKey(filterType, page),
      })
    },
    onError: () => {
      toast.error('❌ Failed to delete wallet')
    },
  })

  // 📦 Query: Wallets
  const walletsQuery = useQuery({
    queryKey: getWalletsQueryKey(filterType, page),
    queryFn: () => fetchWallets(page, pageSize, filterType || undefined),
    enabled: true,
  })

  const handleSync = () => {
    if (!address || !email) {
      toast.warning('⚠️ Email and connected wallet are required.')
      return
    }

    createWalletMutation.mutate({
      email,
      walletAddress: address,
      walletType,
    })
  }

  const shortenAddress = (addr?: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <p className="text-yellow-600 font-medium mt-6">
        ⚠️ Please connect a wallet.
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-6 bg-gray-50 p-6 rounded shadow-md max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800">🔗 Sync Wallet</h3>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Wallet Type Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
        <select
          value={walletType}
          onChange={(e) => setWalletType(e.target.value as WalletType)}
          className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="embedded">Embedded</option>
          <option value="smart">Smart</option>
          <option value="external">External</option>
        </select>
      </div>

      {/* Connected Wallet Info */}
      <div>
        <p className="text-sm text-gray-600">
          Connected Wallet: <span className="font-medium text-black">{shortenAddress(address)}</span>
        </p>
        {token && (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-green-700">✅ Auth token stored</p>
            <button
              onClick={() => {
                clearToken()
                disconnect()
                navigate('/login')
              }}
              className="text-red-600 text-xs underline ml-2"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={createWalletMutation.isPending || !email || !address}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {createWalletMutation.isPending ? '🔄 Saving...' : '💾 Sync Wallet to Backend'}
      </button>

      {/* Filter Wallets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter Wallets</label>
        <select
          value={filterType}
          onChange={(e) => {
            setPage(1)
            setFilterType(e.target.value as WalletType | '')
          }}
          className="border border-gray-300 px-3 py-2 rounded w-full"
        >
          <option value="">All</option>
          <option value="embedded">Embedded</option>
          <option value="smart">Smart</option>
          <option value="external">External</option>
        </select>
      </div>

      {/* Wallet List */}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2">🧾 Wallets</h4>
        {walletsQuery.isLoading ? (
          <p>Loading...</p>
        ) : walletsQuery.isError ? (
          <p className="text-red-600">❌ Failed to load wallets.</p>
        ) : walletsQuery.data?.wallets.length === 0 ? (
          <p className="text-sm text-gray-500">No wallets found.</p>
        ) : (
          <ul className="space-y-2">
            {walletsQuery.data?.wallets.map((wallet) => (
              <li
                key={wallet.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="text-sm">
                    <strong>{wallet.walletType}</strong> -{' '}
                    {shortenAddress(wallet.walletAddress)}
                  </p>
                  <p className="text-xs text-gray-500">{wallet.userEmail}</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(wallet.id)}
                  className="text-xs text-red-600 hover:underline"
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {walletsQuery.data?.wallets.length === pageSize && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="text-sm px-3 py-1 border rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={walletsQuery.data?.wallets.length < pageSize}
              className="text-sm px-3 py-1 border rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
