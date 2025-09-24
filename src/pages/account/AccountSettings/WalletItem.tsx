// components/AccountWallets/WalletItem.tsx
import { Box, Text, Button } from '@chakra-ui/react'

export default function WalletItem({ wallet, deleteWallet }: any) {
  return (
    <Box p={3} borderWidth="1px" borderRadius="md" w="100%">
      <Text fontFamily="monospace" fontWeight="bold">
        {wallet.walletAddress}
      </Text>
      <Text fontSize="sm" color="gray.600">
        Type: {wallet.walletType}
      </Text>
      {wallet.label && <Text fontSize="sm">Label: {wallet.label}</Text>}
      {wallet.chainId && (
        <Text fontSize="sm" color="gray.600">
          Chain ID: {wallet.chainId}
        </Text>
      )}
      {wallet.metadata && (
        <Box
          as="pre"
          p={2}
          mt={2}
          bg="gray.100"
          borderRadius="md"
          whiteSpace="pre-wrap"
          maxHeight="150px"
          overflowY="auto"
          fontSize="sm"
        >
          {JSON.stringify(wallet.metadata, null, 2)}
        </Box>
      )}
      <Button mt={3} size="sm" colorScheme="red" onClick={() => deleteWallet(wallet.walletAddress)}>
        Delete
      </Button>
    </Box>
  )
}
