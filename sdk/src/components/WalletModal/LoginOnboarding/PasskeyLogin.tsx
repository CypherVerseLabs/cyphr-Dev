'use client'

import { Button, useToast } from '@chakra-ui/react'

interface PasskeyLoginProps {
  onStart?: () => void
  onFinish?: () => void
  onError?: (message: string) => void
}

export default function PasskeyLogin({
  onStart,
  onFinish,
  onError,
}: PasskeyLoginProps) {
  const toast = useToast()

  const handlePasskeyLogin = async () => {
    onStart?.()
    try {
      // This is where you would use navigator.credentials.get()
      // Simulating success
      await new Promise((res) => setTimeout(res, 1000))

      toast({
        title: 'Passkey login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err: any) {
      onError?.('Passkey login failed')
    } finally {
      onFinish?.()
    }
  }

  return (
    <Button
      width="100%"
      colorScheme="gray"
      onClick={handlePasskeyLogin}
    >
      Continue with Passkey
    </Button>
  )
}
