import React from 'react'
import { Connector } from 'wagmi'
import { useWalletProviderReady } from './useWalletProviderReady'

const GOLD = '#FFD700'

const WALLET_ICONS: Record<string, string> = {
  injected: '/icons/metamask.svg',
  walletConnect: '/icons/walletconnect.svg',
  baseAccount: '/icons/baseaccount.svg',
  cyph: '/icons/1cyph.png',
}

interface WalletOptionProps {
  connector: Connector
  onClick: () => void
  iconId?: string
  name?: string
  isLoading?: boolean
  disabled?: boolean
}

const WalletOption: React.FC<WalletOptionProps> = ({
  connector,
  onClick,
  iconId,
  name,
  isLoading = false,
  disabled = false,
}) => {
  const { ready, loading } = useWalletProviderReady(connector)

  const iconSrc =
    WALLET_ICONS[iconId ?? connector.id ?? ''] ??
    `/wallet-icons/${iconId ?? connector.id}.svg`

  return (
    <button
      disabled={!ready || loading || isLoading || disabled}
      onClick={onClick}
      className="w-full flex items-center gap-3 text-left px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color: GOLD,
        borderColor: GOLD,
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = '#e6c200'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {iconSrc ? (
        <img src={iconSrc} alt={`${name ?? connector.name} logo`} className="w-6 h-6" />
      ) : (
        <span>🔌</span>
      )}
      {isLoading ? 'Connecting...' : name ?? connector.name}
    </button>
  )
}

export default WalletOption
