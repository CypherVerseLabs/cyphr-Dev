// components/AccountWallets/AccountWallets.tsx
import { useEffect, useState } from 'react'
import { Box, Heading, Text, Flex, Button, Stack, } from '@chakra-ui/react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWallets } from '../../../../sdk/src/hooks/useWallets'
import { fetchUserProfile } from '../../../../sdk/src/api/users'

import ConnectWallet from './ConnectWallet'
import WalletForm from './WalletForm'
import WalletList from './WalletList'
import CreateApiKeyButton from './CreateApiKeyButton'

export default function AccountWallets() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const [displayName, setDisplayName] = useState('')

  const {
    wallets,
    loading,
    error,
    addWallet,
    deleteWallet,
  } = useWallets()

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await fetchUserProfile()
        setDisplayName(profile.displayName || '')
      } catch (err) {
        console.error('Failed to load user profile:', err)
      }
    }

    loadUserProfile()
  }, [])

  return (
    <Box>
      <Heading mb={4}>👛 Wallets</Heading>
      <Text mb={6}>
        Welcome! This is your overview. From here you can manage wallets, view stats, and more.
      </Text>

      {isConnected ? (
        <>

        <Stack spacing={4} mt={6}>
        <CreateApiKeyButton />
      </Stack>
          <Text fontWeight="semibold" mb={2}>
            Hello, {displayName}
          </Text>

          <Flex align="center" mb={4} gap={4}>
            <Text fontFamily="monospace" fontSize="lg" bg="gray.100" p={2} borderRadius="md">
              {shortenAddress(address!)}
            </Text>
            <Button size="sm" colorScheme="red" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </Flex>

          <WalletForm addWallet={addWallet} />
          <WalletList wallets={wallets} loading={loading} error={error} deleteWallet={deleteWallet} />
        </>
      ) : (
        <ConnectWallet />
      )}

      
    </Box>
  )
}
