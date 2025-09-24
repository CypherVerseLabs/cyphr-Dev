// AccountWallets/ClientIdManager.tsx

import { useEffect, useState } from 'react'
import { Box, Heading, Input, Button, Text, Stack, useToast } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { setClientId } from '../../../../sdk/src/api/users'
import { getClientId, saveClientId, clearClientId } from '../../../../sdk/src/utils/clientId'

export default function ClientIdManager() {
  const [clientId, setClientIdInput] = useState('')
  const toast = useToast()

  useEffect(() => {
    const existingId = getClientId()
    if (existingId) {
      setClientIdInput(existingId)
      setClientId(existingId)
    }
  }, [])

  const handleSave = () => {
    if (!clientId.trim()) {
      toast({
        title: 'Client ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    saveClientId(clientId)
    setClientId(clientId)
    toast({
      title: 'Client ID saved!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleClear = () => {
    clearClientId()
    setClientIdInput('')
    setClientId(undefined)
    toast({
      title: 'Client ID cleared.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleGenerate = () => {
    const newId = uuidv4()
    setClientIdInput(newId)
  }

  return (
    <Box maxW="lg" mx="auto" mt={6} p={6} borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>
        Client ID Settings
      </Heading>

      <Text mb={2}>
        Manage your Client ID for session tracking or wallet operations.
      </Text>

      <Input
        placeholder="Enter client ID"
        value={clientId}
        onChange={(e) => setClientIdInput(e.target.value)}
        mb={4}
      />

      <Stack direction="row" spacing={3}>
        <Button colorScheme="blue" onClick={handleSave}>
          Save Client ID
        </Button>

        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>

        <Button onClick={handleGenerate} variant="ghost">
          Generate UUID
        </Button>
      </Stack>
    </Box>
  )
}
