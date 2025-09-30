// src/components/tabs/ReceiveTab.tsx
'use client'

import { useAccount } from 'wagmi'
import {
  Box,
  VStack,
  Heading,
  Code,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

export default function ReceiveTab() {
  const { address } = useAccount()
  const toast = useToast()

  const inputBg = useColorModeValue('white', 'gray.600')

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({ title: 'Address copied', status: 'success', duration: 3000, isClosable: true })
    }
  }

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Heading size="md">Receive Crypto</Heading>
        {address ? (
          <>
            <Code p={2} bg={inputBg} wordBreak="break-all">{address}</Code>
            <Button leftIcon={<CopyIcon />} colorScheme="yellow" onClick={handleCopy}>
              Copy Address
            </Button>
          </>
        ) : (
          <Box>Wallet not connected</Box>
        )}
      </VStack>
    </Box>
  )
}
