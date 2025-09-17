# 🧪 Cyph Wallet Frontend

This is the Vite-powered React frontend for Cyph Wallet, featuring:

- React 19
- TailwindCSS + Chakra UI
- RainbowKit + Wagmi for wallet connection
- Viem + Ethers v6 for chain interaction
- NFT fetcher with metadata resolution
- Clean UX with toast notifications (Sonner)

---

## ⚙️ Setup

### 1. Install dependencies

```bash
cd src
npm install
````

### 2. Create `.env.local`

```env
VITE_RPC_URL=http://localhost:8545
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WC_PROJECT_ID=your_walletconnect_project_id
VITE_NFT_CONTRACT_ADDRESS=0xYourNFTContractAddress
```

---

## 🧪 Run Locally

```bash
npm run dev
```

Runs at: `http://localhost:5173`

---

## 🧱 Tech Stack

* ⚛️ React 19 + Vite
* 💅 Chakra UI + TailwindCSS
* 🌉 RainbowKit + Wagmi
* 🧠 React Query (TanStack)
* 🔌 Viem + Ethers v6
* 🔔 Sonner (toasts)

---

## 🧩 Key Features

* Connect wallets with RainbowKit
* Fetch user-owned NFTs using custom hook
* Use SDK methods via `cyph-wallet-sdk`
* Responsive + themeable UI
* Extensible UI with Chakra components

---

## 📁 File Structure

```
src/
├── pages/
│   ├── Account/
│   └── Home/
├── components/
├── hooks/
├── utils/
├── App.tsx
└── main.tsx
```

---

## ✅ Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview built app
```

---

## 🧾 License

MIT © CypherVerse Labs
