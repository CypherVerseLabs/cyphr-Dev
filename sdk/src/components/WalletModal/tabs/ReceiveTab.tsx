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

  const bgColor = useColorModeValue('white', 'black')
  const codeBg = useColorModeValue('gray.100', 'gray.600')

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: 'Address copied',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={4} bg={bgColor} borderRadius="md">
      <VStack spacing={4}>
        <Heading size="md" color="yellow.400">
          Receive Crypto
        </Heading>
        {address ? (
          <>
            <Code
              p={3}
              w="100%"
              textAlign="center"
              fontSize="sm"
              borderRadius="md"
              bg={codeBg}
              wordBreak="break-all"
            >
              {address}
            </Code>
            <Button
              leftIcon={<CopyIcon />}
              colorScheme="yellow"
              width="100%"
              onClick={handleCopy}
            >
              Copy Address
            </Button>
          </>
        ) : (
          <Box color="gray.400">Wallet not connected</Box>
        )}
      </VStack>
    </Box>
  )
}
