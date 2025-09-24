🔐 Authentication
loginWithEmail
const email = 'user@example.com'

loginWithEmail(email)
  .then(({ token }) => {
    localStorage.setItem('authToken', token)
    console.log('Logged in successfully:', token)
  })
  .catch(console.error)

👤 User Profile
fetchUserProfile
fetchUserProfile()
  .then(profile => {
    console.log('User profile:', profile)
  })
  .catch(console.error)

updateUserProfile
const updatedData = {
  displayName: 'New Name',
  email: 'newemail@example.com',
  avatarFile: selectedFile, // File from input element
}

updateUserProfile(updatedData)
  .then(profile => {
    console.log('Updated profile:', profile)
  })
  .catch(console.error)

deleteUserAccount
deleteUserAccount()
  .then(res => {
    if (res.success) {
      console.log('Account deleted successfully')
    }
  })
  .catch(console.error)

👛 Wallet Management
createUserWallet
const email = 'walletuser@example.com'
const walletAddress = '0x123...abc'
const walletType = 'smart'

createUserWallet(email, walletAddress, walletType)
  .then(response => {
    console.log('Wallet created:', response)
  })
  .catch(console.error)

fetchWallets
fetchWallets(1, 10, 'smart')
  .then(({ wallets }) => {
    console.log('User wallets:', wallets)
  })
  .catch(console.error)

deleteWallet
const walletId = 'abc123'

deleteWallet(walletId)
  .then(res => {
    if (res.success) {
      console.log('Wallet deleted')
    }
  })
  .catch(console.error)

🔁 Admin API
refreshAllENSNames
refreshAllENSNames()
  .then(res => {
    console.log(`Refreshed ${res.refreshed} ENS names`)
  })
  .catch(console.error)

🔗 Wallet Transactions
fetchWalletTransactions
const address = '0xabc...123'

fetchWalletTransactions(address)
  .then(({ transactions }) => {
    console.log('Wallet transactions:', transactions)
  })
  .catch(console.error)

💰 Wallet Asset APIs
fetchNativeBalance
const walletAddress = '0xabc...123'

fetchNativeBalance(walletAddress)
  .then(({ balance }) => {
    console.log(`Native balance: ${balance}`)
  })
  .catch(console.error)

fetchTokenBalances
fetchTokenBalances(walletAddress)
  .then(({ tokens }) => {
    tokens.forEach(token => {
      console.log(`${token.symbol}: ${token.balance}`)
    })
  })
  .catch(console.error)

fetchNFTs
fetchNFTs(walletAddress)
  .then(({ erc721, erc1155 }) => {
    console.log('ERC-721 NFTs:', erc721)
    console.log('ERC-1155 NFTs:', erc1155)
  })
  .catch(console.error)

🧪 Optional: Basic Test Wrapper

To test these functions quickly:

async function testWalletApis() {
  try {
    const token = await loginWithEmail('user@example.com')
    console.log('Logged in:', token)

    const profile = await fetchUserProfile()
    console.log('Profile:', profile)

    const wallets = await fetchWallets()
    console.log('Wallets:', wallets)

    const native = await fetchNativeBalance(wallets.wallets[0].walletAddress)
    console.log('Native Balance:', native.balance)
  } catch (err) {
    console.error('Test failed:', err)
  }
}



other

Here’s a README that documents the modular wallet management system we just refactored — including directory structure, component purpose, and how to use it.

🧾 Wallet Management UI - React Modular Setup

This folder contains a modularized React implementation for connecting wallets, linking them to a user, displaying existing wallets, and deleting them.

✅ Built using:
React + TypeScript + Chakra UI + wagmi + viem + SDK (custom hook: useWallets)

📁 Folder Structure
components/
└── AccountWallets/
    ├── AccountWallets.tsx   # Main entry point
    ├── ConnectWallet.tsx    # UI to connect external wallet (e.g., MetaMask)
    ├── WalletForm.tsx       # Form to add/link a new wallet
    ├── WalletList.tsx       # Displays all user wallets
    ├── WalletItem.tsx       # Displays a single wallet (inside list)

🧩 Components Overview
1. AccountWallets.tsx (Main container)

Renders all the child components.

Fetches wallet data using useWallets() custom hook.

Retrieves display name using fetchUserProfile().

Shows:

Wallet connect UI if not connected

Wallet form, user info, wallet list if connected

2. ConnectWallet.tsx

Lets user connect to an Ethereum-compatible wallet (via wagmi).

Displays a list of available connectors.

Handles loading state while connecting.

3. WalletForm.tsx

Form inputs for:

Wallet address

Wallet type (external, embedded, smart)

Optional label, chain ID, and JSON metadata

Handles:

Input validation

JSON parsing for metadata

Calling addWallet from useWallets()

4. WalletList.tsx

Displays all linked wallets.

Handles loading and error states.

Renders each wallet using WalletItem.

5. WalletItem.tsx

Displays one wallet's info:

Address

Type, label, chainId

Metadata as formatted JSON

Includes a delete button calling deleteWallet.

🔗 Hook: useWallets()

From your SDK (sdk/src/hooks/useWallets.ts), this hook manages wallet CRUD:

const {
  wallets,         // List of Wallets
  loading,         // Fetching state
  error,           // Error message if any
  addWallet,       // Function to add a wallet
  deleteWallet,    // Function to delete
  updateWallet,    // (Optional) for editing
  refetch,         // Refetch wallets
} = useWallets()


Requires SDK API methods like:

fetchWallets()

createUserWallet(userEmail, walletAddress, walletType)

updateWallet()

deleteWallet()

📦 Usage Instructions
📌 Import & Use

Import the main component and place it anywhere in your app:

import AccountWallets from './components/AccountWallets/AccountWallets'

function DashboardPage() {
  return (
    <Box p={6}>
      <AccountWallets />
    </Box>
  )
}

📋 Requirements

✅ Chakra UI (for layout and UI components)

✅ wagmi (wallet connection)

✅ viem or ethers (optional if using SDK internally)

✅ useWallets() and fetchUserProfile() must be implemented in your SDK

🧪 Optional Improvements

✅ Add updateWallet functionality with edit UI

🔐 Only allow wallet changes when authenticated

🔁 Poll or use websockets to auto-refresh wallets

🧪 Add unit tests for each component

✅ Example Flow

User visits page

If wallet not connected → Connect UI shown

Once connected:

Display user profile name and address

Allow user to add new wallets (with type, label, metadata, etc.)

Show list of saved wallets

Allow deleting any of them