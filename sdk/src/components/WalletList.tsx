'use client'

import React, { useState, useEffect } from 'react'
import { Connector, useConnect, useAccount, useDisconnect } from 'wagmi'
import { useAuth } from '../hooks/useAuth'

const GOLD = '#FFD700'

const WALLET_ICONS: Record<string, string> = {
  injected: '/icons/metamask.svg',
  walletConnect: '/icons/walletconnect.svg',
  baseAccount: '/icons/baseaccount.svg',
  cyph: '/icons/1cyph.png',
}

export interface WalletListProps {
  rpcUrl?: string
  chainId?: number
  onSelect?: () => void
  onDisconnect?: () => void
  className?: string
  style?: React.CSSProperties
}

export function WalletList({
  rpcUrl,
  chainId,
  onSelect,
  onDisconnect,
  className = '',
  style,
}: WalletListProps) {
  const { connectors, connect, error } = useConnect()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken } = useAuth()

  const [connectingId, setConnectingId] = useState<string | null>(null)

  const injectedConnector = connectors.find((c) => c.id === 'injected')
  const effectiveRpcUrl = rpcUrl ?? 'http://localhost:8545'
  const effectiveChainId = chainId ?? 5150

  const handleDisconnect = () => {
    disconnect()
    clearToken()
    onSelect?.()
    onDisconnect?.()
  }

  const handleCyphWalletConnect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        })

        const targetHexChain = `0x${effectiveChainId.toString(16)}`

        if (currentChainId !== targetHexChain) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetHexChain,
                chainName: 'CYPH Local Chain',
                nativeCurrency: {
                  name: 'Cypher',
                  symbol: 'CYPH',
                  decimals: 18,
                },
                rpcUrls: [effectiveRpcUrl],
                blockExplorerUrls: [],
              },
            ],
          })
        }

        setConnectingId('cyph-wallet')
        await connect({ connector: injectedConnector!, chainId: effectiveChainId })
        onSelect?.()
      } catch (err) {
        console.error('🔌 Failed to connect to Cyph chain:', err)
      } finally {
        setConnectingId(null)
      }
    }
  }

  const isConnecting = connectingId !== null

  return (
    <div className={`space-y-2 ${className}`} style={style}>
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="w-full text-sm text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100"
        >
          🔌 Disconnect Wallet
        </button>
      )}

      {!isConnected &&
        connectors
          .filter((c) => c.id !== 'injected') // prevent double rendering
          .map((connector) => (
            <WalletOption
              key={connector.id}
              connector={connector}
              onClick={async () => {
                setConnectingId(connector.id)
                try {
                  await connect({ connector })
                  onSelect?.()
                } catch (err) {
                  console.error(`Failed to connect: ${connector.name}`, err)
                } finally {
                  setConnectingId(null)
                }
              }}
              isLoading={connectingId === connector.id}
              disabled={isConnecting}
            />
          ))}

      {!isConnected && injectedConnector && (
        <WalletOption
          key="cyph-wallet"
          connector={injectedConnector}
          iconId="cyph"
          name="Cyph Wallet"
          onClick={handleCyphWalletConnect}
          isLoading={connectingId === 'cyph-wallet'}
          disabled={isConnecting}
        />
      )}

      {error && (
        <p className="text-sm text-red-600">⚠️ {error.message}</p>
      )}
    </div>
  )
}

function WalletOption({
  connector,
  onClick,
  iconId,
  name,
  isLoading = false,
  disabled = false,
}: {
  connector: Connector
  onClick: () => void
  iconId?: string
  name?: string
  isLoading?: boolean
  disabled?: boolean
}) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    connector
      .getProvider?.()
      .then((provider) => {
        if (!cancelled) {
          setReady(!!provider)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(false)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [connector])

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
