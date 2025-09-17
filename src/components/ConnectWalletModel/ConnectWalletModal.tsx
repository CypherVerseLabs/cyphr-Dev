// components/ConnectWalletModal.tsx
import React from 'react'
import { WalletList } from '../../../sdk/components/WalletList'
import { useAccount, useDisconnect } from 'wagmi'

export function ConnectWalletModal() {
  const [open, setOpen] = React.useState(false)
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  // Close modal on connect
  React.useEffect(() => {
    if (isConnected) {
      setOpen(false)
    }
  }, [isConnected])

  return (
    <div>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">{shortAddress(address)}</span>
          <button
            onClick={() => disconnect()}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>

          {open && (
            <Modal onClose={() => setOpen(false)}>
              <h2 className="text-lg font-bold mb-4">Select a Wallet</h2>
              <WalletList onSelect={() => setOpen(false)} />
            </Modal>
          )}
        </>
      )}
    </div>
  )
}

// Small utility to shorten address
function shortAddress(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}

// Basic modal component
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm relative shadow-lg text-gray-900 dark:text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
