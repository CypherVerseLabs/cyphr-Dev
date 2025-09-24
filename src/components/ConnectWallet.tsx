// components/ConnectWallet.tsx
import React from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { WalletList } from './WalletModal/WalletList'

export function ConnectWallet() {
  const [open, setOpen] = React.useState(false)
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono">{shortAddress(address)}</span>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>

      {open && (
        <div className="absolute top-full mt-2 bg-white shadow-lg rounded p-4 z-10">
          <WalletList onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

function shortAddress(address?: string) {
  return address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''
}
