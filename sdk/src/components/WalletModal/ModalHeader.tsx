import { Flex, Text } from '@chakra-ui/react'
import DarkModeToggle from './DarkModeToggle'

interface ModalHeaderProps {
  isConnected: boolean
  address?: string
  themeOverride?: 'light' | 'dark'
}

const shorten = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export default function ModalHeader({
  isConnected,
  address,
  themeOverride,
}: ModalHeaderProps) {
  return (
    <Flex justify="space-between" align="center">
      <Flex align="center" gap={2}>
        <img src="/logo.png" alt="Logo" width="24" height="24" />
        <Text fontSize="sm" fontWeight="bold">
          {isConnected ? `Welcome ${shorten(address)}` : 'Connect'}
        </Text>
      </Flex>
      {!themeOverride && <DarkModeToggle />}
    </Flex>
  )
}
