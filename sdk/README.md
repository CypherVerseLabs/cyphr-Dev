🧩 Cyph Wallet SDK

A modular, plug-and-play TypeScript SDK for building EVM-compatible wallet apps and NFT utilities.

Built with:
- [`ethers` v6](https://docs.ethers.org/)
- [`wagmi`](https://wagmi.sh)
- React + Chakra UI integration
- Tree-shakable, type-safe components and hooks

---

## 📦 Installation

```bash
npm install cyph-wallet-sdk
# or
yarn add cyph-wallet-sdk
````

### Peer Dependencies

* `react` ^18 or ^19
* `wagmi` ^2.16.9
* `@chakra-ui/react` ^2.0.0

---

## 🛠 Usage

### Wrap Your App

```tsx
import { ChakraProvider } from '@chakra-ui/react'
import { WagmiProvider, createConfig, http } from 'wagmi'
 import { mainnet } from 'viem/chains'

const config = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
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
```

---

## 🔌 Components

### `<WalletList />`

```tsx
import { WalletList } from 'cyph-wallet-sdk'

<WalletList
  rpcUrl="http://localhost:8545"
  chainId={31337}
  onSelect={() => console.log("Wallet selected")}
/>
```

### `<WalletModal />`

```tsx
import { WalletModal } from 'cyph-wallet-sdk'

<WalletModal isOpen={true} onClose={() => {}} />
```

### `EmailLogin`, `SocialLoginButton`

```tsx
import { EmailLogin, SocialLoginButton } from 'cyph-wallet-sdk'

<EmailLogin />
<SocialLoginButton provider="google" />
```

---

## 🔐 Hooks

### `useAuth`

```tsx
import { useAuth } from 'cyph-wallet-sdk'

const { token, saveToken, clearToken } = useAuth()
```

---

## 🧪 Local Development

```bash
git clone https://github.com/CypherVerseLabs/cyph-wallet-sdk.git
cd cyph-wallet-sdk
npm install
npm run build
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── WalletList.tsx
│   ├── WalletModal.tsx
│   └── LoginOnboard/
├── hooks/
│   └── useAuth.ts
├── providers/
├── types.ts
└── index.ts
```

---

## 📄 License

MIT © CypherVerse Labs
