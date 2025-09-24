// pages/Home.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Box, Text, VStack } from '@chakra-ui/react'
import WalletModal from '../components/WalletModal/ConnectButton'

export default function Resources() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard')
    }
  }, [isConnected, navigate])

  return (
    <Box textAlign="center" py={16}>
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Resources
        </Text>
        
        <WalletModal />
      </VStack>
    </Box>
  )
}
