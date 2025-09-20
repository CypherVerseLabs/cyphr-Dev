import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Box, Text, VStack, useDisclosure } from '@chakra-ui/react'
import WalletModal from '../../../sdk/src/components/WalletModal/Modal'

export default function Login() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  // Close modal and redirect to /account/dashboard after login
  useEffect(() => {
    if (isConnected) {
      onClose()
      navigate('/account/dashboard')
    }
  }, [isConnected, navigate, onClose])

  return (
    <Box textAlign="center" py={16}>
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Company
        </Text>
        <Text fontSize="md" color="gray.500">
          Connect your wallet to continue
        </Text>
        <WalletModal
          forceOpen={isOpen}
          onForceClose={onClose}
          hideButton={true}
        />
      </VStack>
    </Box>
  )
}
