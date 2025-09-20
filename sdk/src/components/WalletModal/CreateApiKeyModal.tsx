// components/CreateApiKeyModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  Textarea,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'

export function CreateApiKeyModal({ isOpen, onClose, onCreated }: any) {
  const toast = useToast()

  const [name, setName] = useState('')
  const [allowedDomains, setAllowedDomains] = useState('')
  const [bundleIds, setBundleIds] = useState('')
  const [services, setServices] = useState({
    sdk: true,
    rpc: false,
    ipfsUpload: false,
    ipfsDownload: false,
    bundler: false,
    paymaster: false,
  })
  const [creating, setCreating] = useState(false)
  const [clientId, setClientId] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [keyCreated, setKeyCreated] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          allowedDomains,
          bundleIds,
          services,
        }),
      })
      if (!res.ok) throw new Error('Failed to create key')
      const data = await res.json()
      setClientId(data.clientId)
      setSecretKey(data.secretKey)
      setKeyCreated(true)
      onCreated?.()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Unable to create API key.',
        status: 'error',
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create API Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {keyCreated ? (
            <VStack spacing={4}>
              <Text><strong>Client ID:</strong> {clientId}</Text>
              <Text>
                <strong>Secret Key:</strong>{' '}
                <code style={{ backgroundColor: '#eee', padding: '4px' }}>{secretKey}</code>
              </Text>
              <Text color="red.500">
                Store this secret key securely. It will not be shown again.
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>API Key Name</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Allowed Domains</FormLabel>
                <Textarea
                  placeholder="e.g. example.com, app.example.com"
                  value={allowedDomains}
                  onChange={(e) => setAllowedDomains(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Bundle IDs (Optional)</FormLabel>
                <Textarea
                  placeholder="e.g. com.example.myapp"
                  value={bundleIds}
                  onChange={(e) => setBundleIds(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Enable Services</FormLabel>
                <VStack align="start">
                  {Object.entries(services).map(([key, val]) => (
                    <FormControl key={key} display="flex" alignItems="center">
                      <FormLabel htmlFor={key} mb="0">
                        {key}
                      </FormLabel>
                      <Switch
                        id={key}
                        isChecked={val}
                        onChange={(e) =>
                          setServices((s) => ({ ...s, [key]: e.target.checked }))
                        }
                      />
                    </FormControl>
                  ))}
                </VStack>
              </FormControl>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {keyCreated ? (
            <Button colorScheme="green" onClick={onClose}>
              ✅ I’ve stored it
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              onClick={handleCreate}
              isLoading={creating}
              isDisabled={!name.trim()}
            >
              Create Key
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
