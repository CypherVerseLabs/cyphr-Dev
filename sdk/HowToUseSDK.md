How to Use Your Cyphr SDK, Contexts & Hooks in React
1. Setup Your Providers

Wrap your React app in your AuthProvider, CyphrProvider, and ApiProvider so their contexts are available throughout your app.

// src/main.tsx or src/App.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'

import { AuthProvider } from './contexts/AuthContext'
import { CyphrProvider } from './contexts/CyphrContext'
import { ApiProvider } from './contexts/ApiContext'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CyphrProvider>
        <ApiProvider>
          <App />
        </ApiProvider>
      </CyphrProvider>
    </AuthProvider>
  </React.StrictMode>
)

2. Access Auth State and Actions

Use useAuth() anywhere to get the current auth token, user info, and login/logout functions.

import { useAuth } from './contexts/AuthContext'

function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) return <div>Please log in</div>

  return (
    <div>
      <p>Address: {user.address}</p>
      <p>User ID: {user.userId}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

3. Use Cyphr Client to Interact with Backend & SDK

Get your Cyphr client instance with useCyphr() and call its methods:

import { useEffect, useState } from 'react'
import { useCyphr } from './contexts/CyphrContext'

function WalletBalances() {
  const cyphr = useCyphr()
  const [nativeBalance, setNativeBalance] = useState<string | null>(null)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    async function fetchBalances() {
      try {
        const native = await cyphr.wallets.getNativeBalance()
        setNativeBalance(native.balance)

        const tokenBalances = await cyphr.wallets.getTokenBalances()
        setTokens(tokenBalances.tokens)
      } catch (err) {
        console.error('Failed to fetch balances', err)
      }
    }

    fetchBalances()
  }, [cyphr])

  return (
    <div>
      <p>Native Balance: {nativeBalance ?? 'Loading...'}</p>
      <h3>Tokens</h3>
      <ul>
        {tokens.map((token) => (
          <li key={token.contractAddress}>
            {token.symbol}: {token.balance}
          </li>
        ))}
      </ul>
    </div>
  )
}

4. Use Api Context for User and Wallet Management

You have useApi() to manage wallets and user profiles without manually handling API calls.

import { useApi } from './contexts/ApiContext'

function WalletList() {
  const {
    wallets,
    walletsLoading,
    walletsError,
    addWallet,
    updateWallet,
    deleteWallet,
  } = useApi()

  if (walletsLoading) return <div>Loading wallets...</div>
  if (walletsError) return <div>Error: {walletsError}</div>

  return (
    <div>
      <h2>Your Wallets</h2>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            {wallet.label} ({wallet.walletAddress})
            <button onClick={() => deleteWallet(wallet.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Add UI to add/update wallets */}
    </div>
  )
}

5. Example Hook: useNativeBalance (optional, convenience)

You can use your custom hook like this:

import { useNativeBalance } from './hooks/useNativeBalance'

function BalanceDisplay({ address }: { address: string }) {
  const { balance, loading, error } = useNativeBalance(address)

  if (loading) return <p>Loading balance...</p>
  if (error) return <p>Error: {error}</p>

  return <p>Balance: {balance}</p>
}

6. Notes & Tips

Token auto-refresh is handled inside AuthProvider, so you don’t need to worry about token expiry manually.

createCyphrClient auto-injects wallet address and auth token dynamically from context hooks.

You can extend your Cyphr client with new API calls by adding them to sdk/src/api/ and exposing them in createCyphrClient.ts.

Handle API errors gracefully in your components or custom hooks.

Store your API base URLs or sensitive configs in .env files.

You can combine these with wallet connectors like wagmi or thirdweb to handle wallet connections smoothly.

Summary
Tool / Hook / Context	Purpose	How to Use
AuthProvider & useAuth()	Manage login state, token, user info	Wrap app, use useAuth() in components
CyphrProvider & useCyphr()	Backend + SDK client with auth & wallet address	Wrap app, call cyphr.users or cyphr.wallets
ApiProvider & useApi()	Manage user wallets and profiles	Wrap app, call useApi() to fetch/update wallets & user
Custom Hooks like useNativeBalance	Convenient wrappers around SDK calls	Call with wallet address