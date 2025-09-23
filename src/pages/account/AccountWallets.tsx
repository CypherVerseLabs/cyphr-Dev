import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
  Select,
  
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWallets } from '../../../sdk/src/hooks/useWallets'
import { fetchUserProfile } from '../../../sdk/src/api'

export default function AccountWallets() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const toast = useToast()

  const [loadingConnectorId, setLoadingConnectorId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')

  const { wallets, loading, error, addWallet, deleteWallet } = useWallets()

  const [formData, setFormData] = useState({
    address: '',
    walletType: '',
    label: '',
    chainId: '',
    metadata: '',
  })

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const profile = await fetchUserProfile()
        setDisplayName(profile.displayName || '')
      } catch (err) {
        console.error('Failed to load user profile:', err)
      }
    }
    loadUserProfile()
  }, [])

  const handleConnect = async (connector: typeof connectors[number]) => {
    setLoadingConnectorId(connector.id)
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Failed to connect', error)
      toast({
        title: 'Failed to connect wallet',
        description: (error as Error)?.message || 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoadingConnectorId(null)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.address.trim()) {
      toast({
        title: 'Wallet address is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    let parsedMetadata: object | undefined = undefined
    if (formData.metadata.trim()) {
      try {
        parsedMetadata = JSON.parse(formData.metadata)
      } catch {
        toast({
          title: 'Metadata must be valid JSON.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }
    }

    const allowedWalletTypes = ['external', 'embedded', 'smart'] as const
    type WalletType = typeof allowedWalletTypes[number]

    const walletTypeInput = formData.walletType.trim().toLowerCase()
    const walletType = allowedWalletTypes.includes(walletTypeInput as WalletType)
      ? (walletTypeInput as WalletType)
      : 'external' // default fallback

    const newWallet = {
      address: formData.address.trim(),
      walletType,
      label: formData.label.trim() || undefined,
      chainId: formData.chainId ? Number(formData.chainId) : undefined,
      metadata: parsedMetadata,
    }

    try {
      await addWallet(newWallet)
      toast({
        title: 'Wallet linked successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setFormData({
        address: '',
        walletType: '',
        label: '',
        chainId: '',
        metadata: '',
      })
    } catch (err) {
      toast({
        title: 'Failed to link wallet.',
        description: err instanceof Error ? err.message : undefined,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={6}>
      <Heading mb={4}>👛 Wallets</Heading>
      <Text mb={6}>
        Welcome! This is your overview. From here you can manage wallets, view stats, and more.
      </Text>

      {isConnected ? (
        <>
          <Text fontWeight="semibold" mb={2}>
            Hello, {displayName}
          </Text>

          <Flex align="center" mb={4} gap={4}>
            <Text fontFamily="monospace" fontSize="lg" bg="gray.100" p={2} borderRadius="md">
              {shortenAddress(address!)}
            </Text>
            <Button size="sm" colorScheme="red" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </Flex>

          {/* Wallet Linking Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            mb={6}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
          >
            <Heading size="sm" mb={4}>
              Link New Wallet
            </Heading>

            <FormControl id="address" isRequired mb={3}>
              <FormLabel>Wallet Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="0x1234..."
              />
            </FormControl>

            <FormControl id="walletType" mb={3}>
              <FormLabel>Wallet Type</FormLabel>
              <Select
                name="walletType"
                value={formData.walletType}
                onChange={handleChange}
                placeholder="Select wallet type"
              >
                <option value="external">External</option>
                <option value="embedded">Embedded</option>
                <option value="smart">Smart</option>
              </Select>
            </FormControl>

            <FormControl id="label" mb={3}>
              <FormLabel>Label</FormLabel>
              <Input
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="My personal wallet"
                maxLength={64}
              />
            </FormControl>

            <FormControl id="chainId" mb={3}>
              <FormLabel>Chain ID</FormLabel>
              <NumberInput min={1}>
                <NumberInputField
                  name="chainId"
                  value={formData.chainId}
                  onChange={handleChange}
                  placeholder="1"
                />
              </NumberInput>
            </FormControl>

            <FormControl id="metadata" mb={3}>
              <FormLabel>Metadata (JSON)</FormLabel>
              <Textarea
                name="metadata"
                value={formData.metadata}
                onChange={handleChange}
                placeholder={`{\n  "key": "value"\n}`}
                rows={4}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" mt={2}>
              Link Wallet
            </Button>
          </Box>

          {/* Wallet List */}
          <Box>
            <Heading size="sm" mb={2}>
              Your Wallets
            </Heading>

            {loading && <Text>Loading wallets...</Text>}
            {error && <Text color="red.500">Error: {error}</Text>}

            {!loading && !error && wallets.length === 0 && <Text>No wallets found.</Text>}

            {!loading && wallets.length > 0 && (
              <VStack align="start" spacing={4}>
                {wallets.map((wallet) => (
                  <Box key={wallet.address} p={3} borderWidth="1px" borderRadius="md" w="100%">
                    <Text fontFamily="monospace" fontWeight="bold">
                      {wallet.walletAddress}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Type: {wallet.walletType}
                    </Text>
                    {wallet.label && <Text fontSize="sm">Label: {wallet.label}</Text>}
                    {wallet.chainId && (
                      <Text fontSize="sm" color="gray.600">
                        Chain ID: {wallet.chainId}
                      </Text>
                    )}
                    {wallet.metadata && (
                      <Box
                        as="pre"
                        p={2}
                        mt={2}
                        bg="gray.100"
                        borderRadius="md"
                        whiteSpace="pre-wrap"
                        maxHeight="150px"
                        overflowY="auto"
                        fontSize="sm"
                      >
                        {JSON.stringify(wallet.metadata, null, 2)}
                      </Box>
                    )}
                    <Button
                      mt={3}
                      size="sm"
                      colorScheme="red"
                      onClick={() => deleteWallet(wallet.walletAddress)}
                      >
                      Delete
                    </Button>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </>
      ) : (
        <>
          <Text mb={4}>No wallet connected.</Text>
          <Stack spacing={2}>
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                isLoading={loadingConnectorId === connector.id}
                disabled={!connector.ready || loadingConnectorId !== null}
              >
                Connect {connector.name}
              </Button>
            ))}
          </Stack>
        </>
      )}

      <Stack spacing={4} mt={6}>
        <Link to="/wallets">
          <Button colorScheme="blue" w="100%">
            Go to Wallet Manager
          </Button>
        </Link>
      </Stack>
    </Box>
  )
}
