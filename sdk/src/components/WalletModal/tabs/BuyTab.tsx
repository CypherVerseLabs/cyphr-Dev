'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import {
  Box,
  VStack,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { MoonPayBuyWidget, MoonPayProvider } from '@moonpay/moonpay-react'
import { Transak } from '@transak/transak-sdk'

interface BuyTabProps {
  moonpayApiKey: string
  transakApiKey: string
}

export default function BuyTab({ moonpayApiKey, transakApiKey }: BuyTabProps) {
  const toast = useToast()
  const { address } = useAccount()
  const [moonPayVisible, setMoonPayVisible] = useState(false)
  const [transakLoading, setTransakLoading] = useState(false)
  const [transakWidget, setTransakWidget] = useState<Transak | null>(null)

  const inputBg = useColorModeValue('white', 'gray.600')

  useEffect(() => {
    return () => {
      if (transakWidget) transakWidget.close()
    }
  }, [transakWidget])

  const handleMoonPayShow = () => {
    setMoonPayVisible(true)
  }

  const handleTransakShow = () => {
    const config = {
      apiKey: transakApiKey,
      environment: 'PRODUCTION',
      defaultCryptoCurrency: 'ETH',
      walletAddress: address ?? '',
      fiatCurrency: 'USD',
      widgetHeight: '550px',
      widgetWidth: '100%',
      themeColor: '000000',
    }

    const widget = new Transak(config as any)
    setTransakWidget(widget)
    setTransakLoading(true)
    widget.init()

    ;(widget as any).on('TRANSAK_ORDER_SUCCESSFUL', (orderData: { id: string }) => {
      toast({
        title: 'Transak Order Successful',
        description: `Order ID: ${orderData.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      widget.close()
    })

    ;(widget as any).on('TRANSAK_WIDGET_CLOSE', () => {
      setTransakLoading(false)
    })
  }

  return (
    <Box p={4} bg={inputBg} borderRadius="md">
      <VStack spacing={4}>
        {moonPayVisible && (
          <MoonPayProvider apiKey={moonpayApiKey}>
            <MoonPayBuyWidget
              variant="overlay"
              visible={moonPayVisible}
              walletAddress={address ?? undefined}
              onUrlSignatureRequested={async (url: string) => {
                const res = await fetch('/api/moonpay/sign-url', {
                  method: 'POST',
                  body: JSON.stringify({ url }),
                })
                const data = await res.json()
                return data.signature
              }}
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
              }}
            />
          </MoonPayProvider>
        )}

        <Button
          width="100%"
          colorScheme="yellow"
          onClick={handleMoonPayShow}
        >
          Buy with MoonPay
        </Button>

        <Button
          width="100%"
          colorScheme="yellow"
          isLoading={transakLoading}
          onClick={handleTransakShow}
        >
          Buy with Transak
        </Button>
      </VStack>
    </Box>
  )
}
