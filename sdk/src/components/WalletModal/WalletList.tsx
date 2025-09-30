'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useConnect, useAccount, useDisconnect, Connector } from 'wagmi'
import { useAuth } from '../../hooks/useAuth'
import WalletOption from '../../../../src/components/WalletApps'

export interface WalletListProps {
  rpcUrl?: string
  chainId?: number
  onSelect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
  onConnectingChange?: (isConnecting: boolean) => void
  className?: string
  style?: React.CSSProperties
  maxProviders?: number

  // New prop for recommended wallet connector IDs
  recommendedWallets?: string[]
}

export const WalletList: React.FC<WalletListProps> = ({
  chainId,
  onSelect,
  onDisconnect,
  onError,
  onConnectingChange,
  className = '',
  style,
  maxProviders,
  recommendedWallets = [],
}) => {
  const { connectors, connect, error } = useConnect()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken } = useAuth()

  const [connectingId, setConnectingId] = useState<string | null>(null)

  // Filter recommended connectors
  const recommendedConnectors = connectors.filter(c =>
    recommendedWallets.includes(c.id)
  )

  // The rest of connectors excluding recommended
  const otherConnectors = connectors.filter(
    c => !recommendedWallets.includes(c.id)
  )

  const displayedOtherConnectors = maxProviders
    ? otherConnectors.slice(0, maxProviders)
    : otherConnectors

  const isConnecting = connectingId !== null

  const disconnectBtnBg = useColorModeValue('red.50', 'red.900')
  const disconnectBtnText = useColorModeValue('red.600', 'red.300')

  const handleDisconnect = () => {
    disconnect()
    clearToken()
    onDisconnect?.()
  }

  const handleConnect = (connector: Connector, customId?: string) => async () => {
    const id = customId ?? connector.id
    setConnectingId(id)
    onConnectingChange?.(true)

    try {
      if (chainId && connector.id !== 'injected') {
        await connect({ connector, chainId })
      } else {
        await connect({ connector })
      }
      onSelect?.()
    } catch (err) {
      console.error(`[WalletList] Failed to connect: ${connector.name}`, err)
      if (err instanceof Error) onError?.(err)
    } finally {
      setConnectingId(null)
      onConnectingChange?.(false)
    }
  }

  return (
    <Box className={className} style={style} aria-busy={isConnecting}>
      {isConnected ? (
        <Button
          onClick={handleDisconnect}
          bg={disconnectBtnBg}
          color={disconnectBtnText}
          variant="outline"
          width="100%"
          _hover={{ bg: 'red.100' }}
          fontWeight="medium"
          data-testid="disconnect-wallet-button"
          aria-label="Disconnect Wallet"
        >
          🔌 Disconnect Wallet
        </Button>
      ) : (
        <>
          {recommendedConnectors.length > 0 && (
            <>
              <Text fontWeight="bold" mb={2}>
                Recommended Wallets
              </Text>
              <Stack spacing={3} mb={6}>
                {recommendedConnectors.map((connector) => (
                  <WalletOption
                    key={connector.id}
                    connector={connector}
                    onClick={handleConnect(connector)}
                    isLoading={connectingId === connector.id}
                    disabled={isConnecting}
                  />
                ))}
              </Stack>
            </>
          )}

          
          <Stack spacing={3}>
            {displayedOtherConnectors.map((connector) => (
              <WalletOption
                key={connector.id}
                connector={connector}
                onClick={handleConnect(connector)}
                isLoading={connectingId === connector.id}
                disabled={isConnecting}
              />
            ))}
          </Stack>

          {connectors.length === 0 && (
            <Text fontSize="sm" color="gray.500">
              No wallet connectors available.
            </Text>
          )}
        </>
      )}

      {error && (
        <Text
          fontSize="sm"
          color="red.500"
          mt={2}
          aria-live="polite"
          role="alert"
        >
          ⚠️ {error.message}
        </Text>
      )}
    </Box>
  )
}

export default WalletList
