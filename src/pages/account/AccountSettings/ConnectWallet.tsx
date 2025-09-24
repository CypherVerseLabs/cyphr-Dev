// components/AccountWallets/ConnectWallet.tsx
import { useState } from 'react'
import { Button, Stack, Text } from '@chakra-ui/react'
import { useConnect } from 'wagmi'

export default function ConnectWallet() {
  const { connectors, connect } = useConnect()
  const [loadingConnectorId, setLoadingConnectorId] = useState<string | null>(null)

  const handleConnect = async (connector: any) => {
    setLoadingConnectorId(connector.id)
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Failed to connect', error)
    } finally {
      setLoadingConnectorId(null)
    }
  }

  return (
    <>
      <Text mb={4}>No wallet connected.</Text>
      <Stack spacing={2}>
        {connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => handleConnect(connector)}
            isLoading={loadingConnectorId === connector.id}
            disabled={!connector.ready}
          >
            Connect {connector.name}
          </Button>
        ))}
      </Stack>
    </>
  )
}
