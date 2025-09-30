'use client'

import { useAccount } from 'wagmi'
import {
  Box,
  Heading,
  Text,
  Code,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'

export default function Receive() {
  const { address } = useAccount()
  const toast = useToast()

  const bg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('black', 'white')

  const handleCopy = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      toast({
        title: 'Address copied to clipboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="8"
      p="6"
      bg={bg}
      color={textColor}
      borderRadius="md"
      boxShadow="md"
      textAlign="center"
    >
      <Heading mb="4" size="lg">
        Receive Crypto
      </Heading>

      {address ? (
        <>
          <Text mb="2">Share this address to receive funds:</Text>
          <Code
            p="2"
            mb="4"
            display="inline-block"
            maxW="100%"
            whiteSpace="break-spaces"
            wordBreak="break-word"
          >
            {address}
          </Code>
          <Button
            leftIcon={<CopyIcon />}
            onClick={handleCopy}
            colorScheme="yellow"
            variant="solid"
          >
            Copy Address
          </Button>
        </>
      ) : (
        <Text>Wallet not connected.</Text>
      )}
    </Box>
  )
}
