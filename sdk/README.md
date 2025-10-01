@cyphr/sdk 🛠️

SDK for integrating Cyph Wallet with React, Chakra UI, and Wagmi.
Provides reusable UI components and utilities for wallet auth, social login, API key management, and Web3 balance queries.

✨ Features

🔐 Social, email, phone, and wallet login UI

🔑 API key generation modal

💳 Wallet balances, NFTs, transactions

🧱 Built with Chakra UI + Wagmi

📦 ESM/CJS exports with full TypeScript support

📦 Installation
npm install @cyphr/sdk


Peer Dependencies:

npm install react wagmi @chakra-ui/react

🧱 Components
1. UnauthenticatedContent

UI for users to connect with wallet, phone, email, social login, or passkey.

✅ Usage:
import UnauthenticatedContent from '@cyphr/sdk'

<UnauthenticatedContent
  chainId={1}
  rpcUrl="https://mainnet.infura.io/v3/YOUR_KEY"
  showWallets
  showSocialLogins
  showEmailLogin
  showPhoneLogin
  showPasskeyLogin={false}
  onClose={() => console.log('modal closed')}
/>

Props
Prop	Type	Description
chainId	number	Target chain (e.g. 1 for Ethereum Mainnet)
rpcUrl	string?	Optional RPC provider URL
showWallets	boolean	Show wallet connector section
showSocialLogins	boolean	Show social login buttons (Twitter, etc.)
showEmailLogin	boolean	Show email login UI
showPhoneLogin	boolean	Show phone login UI
showPasskeyLogin	boolean	Enable passkey login (not yet implemented)
onClose	() => void	Called on successful login or close
2. CreateApiKeyModal

A modal to securely generate and configure API keys.

✅ Usage:
import { CreateApiKeyModal } from '@cyphr/sdk'
import { useDisclosure } from '@chakra-ui/react'

const { isOpen, onOpen, onClose } = useDisclosure()

<CreateApiKeyModal
  isOpen={isOpen}
  onClose={onClose}
  onCreated={() => alert('API key created')}
/>

Props
Prop	Type	Description
isOpen	boolean	Modal visibility
onClose	() => void	Close handler
onCreated	() => void	Callback after API key is created

⚠️ The secret key is shown only once — instruct users to save it!

3. WalletApps

Displays a styled wallet button (with icon, spinner, disabled state).

✅ Usage:
import WalletApps from '@cyphr/sdk'

<WalletApps
  connector={{ id: 'metamask', name: 'MetaMask' }}
  onClick={() => connectWallet()}
  isLoading={false}
  disabled={false}
/>

Props
Prop	Type	Description
connector	any	Wallet info (id, name)
onClick	() => void	Click handler
isLoading	boolean	Show spinner
disabled	boolean	Disable interaction
iconId	string?	Optional override for icon lookup
name	string?	Optional name override
4. AuthenticatedContent

Used after login to show links and logout options.

✅ Usage:
import AuthenticatedContent from '@cyphr/sdk'
import { FaHome, FaUser } from 'react-icons/fa'

<AuthenticatedContent
  navLinks={[
    { label: 'Home', href: '/home', icon: FaHome },
    { label: 'Profile', href: '/profile', icon: FaUser },
  ]}
  onLogout={() => console.log('Logging out')}
  onClose={() => console.log('Closing nav')}
  currentPath="/home"
  logoutRedirectPath="/login"
/>

Props
Prop	Type	Description
navLinks	NavLink[]	Links to show (label, href, icon)
onLogout	() => void	Logout handler
onClose	() => void	Close the nav menu
currentPath	string	Current route path (for active link state)
logoutRedirectPath	string?	Redirect after logout (default: /login)
🧪 API Utilities

All fetches use built-in authFetch (with credentials: include).

1. src/api/users.ts
setClientId(clientId?: string)
fetchUserProfile(): Promise<UserProfile>

2. sdk/src/api/wallets.ts
setClientId(clientId?: string)
getWalletTransactions(address: string, opts?): Promise<WalletTransaction[]>
getNativeBalance(address: string): Promise<NativeBalance>
getTokenBalances(address: string): Promise<TokenBalance[]>
getWalletNFTs(address: string): Promise<NFT[]>

🧰 Build Setup
npm run build


Uses tsup to bundle into:

CommonJS (dist/index.cjs.js)

ESM (dist/index.esm.js)

Type declarations (dist/index.d.ts)

The build outputs are available via exports in package.json.

📁 Package Exports
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.esm.js",
    "require": "./dist/index.cjs.js"
  },
  "./utils": {
    "import": "./dist/utils/index.esm.js",
    "require": "./dist/utils/index.cjs.js",
    "types": "./dist/utils/index.d.ts"
  }
}

📚 Repository

🔗 GitHub: CypherVerseLabs/cyph-wallet-sdk

📜 License

MIT © CypherVerseLabs