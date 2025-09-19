import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  Spinner,
  
  
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useWallets } from '../../hooks/useWallets'
import { fetchUserProfile, UserProfile } from '../../api'

function formatBalance(balance: number | string | undefined) {
  if (balance == null) return '-'
  const num = typeof balance === 'string' ? parseFloat(balance) : balance
  if (isNaN(num)) return '-'
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}

export default function Dashboard() {
  const { wallets, loading, error } = useWallets()
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile: UserProfile = await fetchUserProfile()
        setDisplayName(profile.displayName || '')
      } catch (err) {
        console.error('Failed to load user profile:', err)
      }
    }
    loadUserProfile()
  }, [])

  const totalBalance = wallets.reduce((sum, w) => {
    const bal = typeof w.balance === 'string' ? parseFloat(w.balance) : w.balance
    if (typeof bal === 'number' && !isNaN(bal)) return sum + bal
    return sum
  }, 0)

  return (
    <Box p={6}>
      <Heading mb={4}>📊 Dashboard</Heading>

      {/* Greeting */}
      <Text mb={6} fontSize="lg" fontWeight="semibold">
        Welcome{displayName ? `, ${displayName}` : ''}! This is your overview. From here you
        can manage wallets, view stats, and more.
      </Text>

      <Stack spacing={6} mb={6}>
        <Link to="/wallets">
          <Button colorScheme="blue" w="100%">
            Go to Wallet Manager
          </Button>
        </Link>
      </Stack>

      {/* Wallet Summary */}
      <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
        <Heading size="sm" mb={4}>
          Wallet Summary
        </Heading>

        {loading && <Spinner />}

        {error && (
          <Text color="red.500" mb={4}>
            Error loading wallets: {error}
          </Text>
        )}

        {!loading && !error && wallets.length === 0 && (
          <Text>No wallets linked yet. Start by adding a new wallet!</Text>
        )}

        {!loading && wallets.length > 0 && (
          <>
            <Text fontWeight="bold" mb={3}>
              Total Balance: {formatBalance(totalBalance)}
            </Text>
            <VStack align="start" spacing={3}>
              {wallets.map((wallet) => (
                <Box
                  key={wallet.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  w="100%"
                  bg="white"
                >
                  <Text fontWeight="bold" fontFamily="monospace" isTruncated>
                    {wallet.walletAddress}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Type: {wallet.walletType}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    Balance: {formatBalance(wallet.balance)}
                  </Text>
                  {wallet.label && <Text fontSize="sm">Label: {wallet.label}</Text>}
                  {wallet.chainId && (
                    <Text fontSize="sm" color="gray.600">
                      Chain ID: {wallet.chainId}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </>
        )}
      </Box>
    </Box>
  )
}
