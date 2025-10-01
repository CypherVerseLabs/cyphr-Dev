// src/components/tabs/SendTab.tsx
'use client'

import { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { sendCrypto } from '../../../utils'
import {
  Box,
  VStack,
  Input,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'

export default function SendTab() {
  const { data: walletClient } = useWalletClient()
  const toast = useToast()

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inputBg = useColorModeValue('white', 'gray.600')

  const handleSend = async () => {
    if (!walletClient) {
      toast({ title: 'Wallet not connected', status: 'warning', duration: 3000, isClosable: true })
      return
    }
    if (!to || !amount) {
      toast({ title: 'Missing address or amount', status: 'error', duration: 3000, isClosable: true })
      return
    }
    setLoading(true)
    try {
      const hash = await sendCrypto({ walletClient, to: to as `0x${string}`, amount })
      setTxHash(hash)
      toast({ title: 'Transaction sent', description: hash, status: 'success', duration: 5000, isClosable: true })
    } catch (err: any) {
      toast({ title: 'Error sending', description: err.message || 'Something went wrong', status: 'error', duration: 5000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <Input
          placeholder="Recipient Address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          bg={inputBg}
        />
        <Input
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          bg={inputBg}
        />
        <Button width="100%" onClick={handleSend} isLoading={loading} colorScheme="yellow">
  Send
</Button>
        {txHash && <Box>Transaction Hash: {txHash}</Box>}
      </VStack>
    </Box>
  )
}
