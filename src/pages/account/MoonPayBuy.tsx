'use client'

import { useRef } from 'react'
import {
  Box,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Heading,
} from '@chakra-ui/react'
import { loadMoonPay } from '@moonpay/moonpay-js'
import { useAccount } from 'wagmi'

interface MoonPayBuyProps {
  apiKey: string
}

export default function MoonPayBuy({ apiKey }: MoonPayBuyProps) {
  const { address } = useAccount()
  const toast = useToast()
  const widgetRef = useRef<any>(null)

  const bg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('black', 'white')
  const buttonBg = useColorModeValue('gold.500', 'gold.300')
  const buttonHoverBg = useColorModeValue('gold.600', 'gold.400')

  const handleOpen = async () => {
    const moonpay = await loadMoonPay()

    if (!moonpay) {
      toast({
        title: 'MoonPay SDK failed to load',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    if (typeof moonpay !== 'function') {
      toast({
        title: 'MoonPay SDK is not callable',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    const widget = moonpay({
      flow: 'buy',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      variant: 'overlay',
      params: {
        apiKey: apiKey,
        walletAddress: address ?? undefined,
        currencyCode: 'ETH',
        baseCurrencyCode: 'USD',
      },
    })

    if (!widget) {
      toast({
        title: 'Failed to create MoonPay widget',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    widgetRef.current = widget

    widget.show()

    // Use `any` cast because typings likely missing on `.on`
    ;(widget as any).on('onTransactionSuccess', (data: any) => {
      console.log('MoonPay transaction successful:', data)
      toast({
        title: 'Purchase successful',
        description: `Order ID: ${data.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    })

    ;(widget as any).on('onClose', () => {
      console.log('MoonPay widget closed')
    })
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
      <Heading size="lg" mb="4">
        Buy Crypto with MoonPay
      </Heading>
      <Text mb="6">Quickly purchase crypto via MoonPay.</Text>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
        color="black"
        fontWeight="bold"
        onClick={handleOpen}
      >
        Buy Now
      </Button>
    </Box>
  )
}
