'use client'
import React from 'react'
import {
  Button,
  Flex,
  Spinner,
  Text,
  Image,
  Tooltip,
} from '@chakra-ui/react'

export interface WalletAppsProps {
  connector: any
  iconId?: string
  name?: string
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

// 🧠 Known aliases for better matching
const ICON_ALIASES: Record<string, string> = {
  metamask: 'metamask',
  walletconnect: 'walletconnect',
  coinbase: 'coinbase',
  injected: 'browserwallet',
  phantom: 'phantom',
  brave: 'brave',
  trustwallet: 'trustwallet',
  okx: 'okx',
  rainbow: 'rainbow',
  zerion: 'zerion',
  safe: 'safe',
  cyph: 'cyph',
}

const normalizeIconId = (id: string | undefined): string => {
  if (!id) return 'default'
  const normalized = id.toLowerCase().replace(/\s/g, '')
  return ICON_ALIASES[normalized] ?? normalized
}

const WalletApps: React.FC<WalletAppsProps> = ({
  connector,
  iconId,
  name,
  onClick,
  isLoading,
  disabled,
}) => {
  const displayName = name ?? connector?.name ?? 'Unknown Wallet'
  const normalizedId = normalizeIconId(iconId ?? connector?.id ?? connector?.name)
  const imageSrc = `/wallets/${normalizedId}.svg`

  return (
    <Tooltip label={disabled ? 'Please wait...' : displayName} hasArrow>
      <Button
        onClick={onClick}
        isDisabled={disabled}
        variant="outline"
        width="100%"
        justifyContent="space-between"
        px={4}
        py={3}
        fontWeight="medium"
        data-testid={`wallet-${normalizedId}`}
      >
        <Flex align="center" gap={2}>
          <Image
            src={imageSrc}
            alt={`${displayName} logo`}
            boxSize="20px"
            fallbackSrc="/wallets/default.svg"
          />
          <Text>{displayName}</Text>
        </Flex>

        {isLoading && <Spinner size="sm" />}
      </Button>
    </Tooltip>
  )
}

export default WalletApps
