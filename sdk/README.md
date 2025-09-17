✅ Updated README.md
✅ Updated README.md
# Cyph Wallet SDK

A plug-and-play React SDK to integrate **Cyph Wallet** login, wallet connection, and social/email login into your dApp. Built with:

- [wagmi](https://wagmi.sh)
- [Chakra UI](https://chakra-ui.com/)
- EVM-compatible chains

---

## 📦 Installation

```bash
npm install cyph-wallet-sdk
# or
yarn add cyph-wallet-sdk


Peer dependencies required:

react (18 or 19)

wagmi (^2.16.9)

@chakra-ui/react (^2.0.0)

⚙️ Setup

Wrap your app with WagmiProvider and ChakraProvider (typically in _app.tsx, main.tsx, or App.tsx):

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'viem/chains'
import { ChakraProvider } from '@chakra-ui/react'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})

function App() {
  return (
    <WagmiProvider config={config}>
      <ChakraProvider>
        <YourApp />
      </ChakraProvider>
    </WagmiProvider>
  )
}

🧩 Components
🔌 WalletList

Renders a list of wallet connection options (MetaMask, WalletConnect, Cyph, etc.).

import { WalletList } from 'cyph-wallet-sdk'

function ConnectWallet() {
  return <WalletList />
}


Props:

interface WalletListProps {
  rpcUrl?: string       // Custom RPC URL for Cyph chain
  chainId?: number      // Chain ID to switch to when connecting
  onSelect?: () => void // Callback after connect/disconnect
}

🪪 WalletModal

A full-screen modal with wallet connection options.

import { WalletModal } from 'cyph-wallet-sdk'

function Page() {
  return <WalletModal isOpen={true} onClose={() => {}} />
}

📧 EmailLogin and SocialLoginButton

Custom login components for off-chain authentication (optional).

import {
  EmailLogin,
  SocialLoginButton
} from 'cyph-wallet-sdk'

<EmailLogin />
<SocialLoginButton provider="google" />

🔐 Hook: useAuth

Access and manage authentication tokens (used internally by wallet components).

import { useAuth } from 'cyph-wallet-sdk'

const { token, saveToken, clearToken } = useAuth()

🧑‍💻 Development (Local)

If you're contributing or using this SDK locally:

git clone https://github.com/CypherVerseLabs/cyph-wallet-sdk.git
cd cyph-wallet-sdk
npm install
npm run build

📁 Project Structure
src/
├── components/
│   ├── WalletList.tsx
│   ├── WalletModal.tsx
│   └── LoginOnboard/
│       ├── EmailLogin.tsx
│       └── SocialLoginButton.tsx
├── Hooks/
│   └── useAuth.ts
├── providers/
│   └── CypherProvider.tsx
├── types.ts
└── index.ts

🧾 License

MIT © [Your Name or Organization]