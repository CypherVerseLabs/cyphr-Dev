'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Box, VStack, Button, useToast, useColorModeValue } from '@chakra-ui/react'
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

  const btnBg = useColorModeValue('gold.500', 'gold.300')
  const btnHoverBg = useColorModeValue('gold.600', 'gold.400')

  useEffect(() => {
    return () => {
      if (transakWidget) {
        transakWidget.close()
      }
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
      themeColor: useColorModeValue('000000', 'FFFFFF').replace('#', ''),
    }

    const widget = new Transak(config as any)  // cast config as any to bypass typing issue
    setTransakWidget(widget)
    setTransakLoading(true)
    widget.init()

    // Cast widget as any to use .on event listeners without TS errors
    ;(widget as any).on('TRANSAK_ORDER_SUCCESSFUL', (orderData: { id: any }) => {
      toast({
        title: 'Transak order successful',
        description: `Order ID ${orderData.id}`,
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
    <Box p={4}>
      <VStack spacing={4}>
        <MoonPayProvider apiKey={moonpayApiKey}>
          {moonPayVisible && (
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
          )}
        </MoonPayProvider>
        <Button
          width="100%"
          bg={btnBg}
          _hover={{ bg: btnHoverBg }}
          color="black"
          onClick={handleMoonPayShow}
        >
          Buy with MoonPay
        </Button>

        <Button
          width="100%"
          bg={btnBg}
          _hover={{ bg: btnHoverBg }}
          color="black"
          isLoading={transakLoading}
          onClick={handleTransakShow}
        >
          Buy with Transak
        </Button>
      </VStack>
    </Box>
  )
}
