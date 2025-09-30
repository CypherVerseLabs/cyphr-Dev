'use client'

import { useEffect, useRef } from 'react'
import { Box, useToast, useColorModeValue } from '@chakra-ui/react'
import { Transak } from '@transak/transak-sdk'

export default function BuyCrypto() {
  const toast = useToast()
  const widgetRef = useRef<InstanceType<typeof Transak> | null>(null)

  useEffect(() => {
    const config = {
  apiKey: 'YOUR_TRANSAK_API_KEY', // ✅ Replace with your actual key
  environment: 'PRODUCTION' as const, // ✅ This fixes the TS error
  defaultCryptoCurrency: 'ETH',
  walletAddress: '', // optional
  fiatCurrency: 'USD',
  themeColor: '000000',
  hostURL: window.location.origin,
  widgetHeight: '550px',
  widgetWidth: '100%',
  widgetUrl: window.location.origin,
  referrer: window.location.href,
}

    const transak = new Transak(config)
    widgetRef.current = transak

    transak.init()

    ;(transak as any).on('ORDER_SUCCESSFUL', (orderData: any) => {
      console.log('Order successful:', orderData)
      toast({
        title: 'Purchase successful!',
        description: `Order ID: ${orderData.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      transak.close()
    })

    ;(transak as any).on('CLOSED', () => {
      console.log('Transak widget closed')
    })

    return () => {
      transak.close()
    }
  }, [toast])

  const bg = useColorModeValue('white', 'gray.800')
  const color = useColorModeValue('black', 'white')

  return (
    <Box bg={bg} color={color} p="4">
      <div id="transak-widget-container" style={{ width: '100%', height: '550px' }} />
    </Box>
  )
}
