import { useState, useEffect } from 'react'
import { Button, Text, VStack, useToast, Box } from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { getClientId, saveClientId, clearClientId } from '../../../../sdk/src/utils/clientId'

export default function CreateApiKeyButton() {
  const [clientId, setClientId] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const existingId = getClientId()
    if (existingId) setClientId(existingId)
  }, [])

  const handleGenerate = () => {
    const newId = uuidv4()
    saveClientId(newId)
    setClientId(newId)
    toast({
      title: 'Client ID created!',
      description: 'Your new API key has been saved.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleClear = () => {
    clearClientId()
    setClientId(null)
    toast({
      title: 'Client ID cleared',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <VStack align="start" spacing={3}>
        <Box>
          <Text fontWeight="medium">API Key (Client ID)</Text>
          {clientId ? (
            <Text
              fontFamily="monospace"
              p={2}
              bg="gray.100"
              borderRadius="md"
              fontSize="sm"
              mt={1}
              wordBreak="break-all"
            >
              {clientId}
            </Text>
          ) : (
            <Text color="gray.500" fontSize="sm" mt={1}>
              No API key generated yet.
            </Text>
          )}
        </Box>

        <Button colorScheme="blue" onClick={handleGenerate}>
          Generate API Key
        </Button>

        {clientId && (
          <Button onClick={handleClear} variant="outline" colorScheme="red" size="sm">
            Clear API Key
          </Button>
        )}
      </VStack>
    </Box>
  )
}
