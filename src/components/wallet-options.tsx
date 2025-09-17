import WalletManager from '../../sdk/src/components/WalletManager'
import { WalletList } from '../../sdk/src/components/WalletList'
import { useAccount, useDisconnect } from 'wagmi'

function App() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  const shortenAddress = (addr?: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <header className="flex items-center space-x-4">
        <img src="/logo.png" alt="App Logo" className="w-12 h-12" />
        <h1 className="text-2xl font-bold">My Wallet App</h1>
      </header>

      {!isConnected ? (
        <>
          <p className="mb-4">Please connect a wallet:</p>
          <WalletList />
        </>
      ) : (
        <>
          <p>
            Connected Wallet: <strong>{shortenAddress(address)}</strong>
          </p>
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>

          <WalletManager />
        </>
      )}
    </div>
  )
}

export default App
