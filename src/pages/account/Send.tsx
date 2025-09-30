'use client'

import  { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { sendCrypto } from '../../../sdk/src/utils/sendCrypto'
import {
  Box,
  Heading,
  Input,
  Button,
  useToast,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'

export default function Send() {
  const { data: walletClient } = useWalletClient()
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const toast = useToast()

  // Get colors from theme (similar to modal colors)
  const bg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('black', 'white')
  const buttonBg = useColorModeValue('gold.500', 'gold.300')
  const buttonHoverBg = useColorModeValue('gold.600', 'gold.400')

  const handleSend = async () => {
    if (!walletClient) return

    try {
      const hash = await sendCrypto({
        walletClient,
        to: to as `0x${string}`, // Type-safe hex address
        amount,
      })

      setTxHash(hash)
      toast({
        title: 'Transaction sent',
        description: hash,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Send failed:', err)
      toast({
        title: 'Transaction failed',
        description: (err as Error).message || 'Please try again',
        status: 'error',
        duration: 5000,
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
    >
      <Heading mb="4" size="lg" textAlign="center">
        Send Crypto
      </Heading>

      <Input
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        mb="4"
        focusBorderColor={buttonBg}
      />

      <Input
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb="4"
        focusBorderColor={buttonBg}
      />

      <Button
        width="100%"
        bg={buttonBg}
        color="black"
        _hover={{ bg: buttonHoverBg }}
        fontWeight="bold"
        onClick={handleSend}
        aria-label="Send crypto transaction"
      >
        Send
      </Button>

      {txHash && (
        <Text mt="4" color="green.400" wordBreak="break-all" fontSize="sm">
          ✅ Transaction sent: {txHash}
        </Text>
      )}
    </Box>
  )
}
