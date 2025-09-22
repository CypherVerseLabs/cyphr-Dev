import  { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Divider,
  Link as ChakraLink,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useUserNFTs } from '../../../sdk/src/hooks/useUserNFTs'
import nftAbi from '../../../sdk/src/abis/NFT.json'




// Replace with your actual deployed contract address
const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS || ''

const RPC_URL = 'http://localhost:8545' // Local or external RPC

const navLinks = [
  { label: '📊 Dashboard', href: '/account/dashboard' },
  { label: '👤 My Account', href: '/account' },
  { label: '👛 Wallets', href: '/account/wallets' },
  { label: '🖼️ NFTs', href: '/account/nfts' },
  { label: '⚙️ Settings', href: '/account/settings' },
  { label: '🖥 Devices', href: '/account/devices' },
]

function resolveImageUri(uri: string | undefined): string {
  if (!uri) return '/placeholder.png'
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  return uri
}

export default function NFTOverview() {
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedNFT, setSelectedNFT] = useState<any>(null)

  const { nfts, loading, error } = useUserNFTs({
    rpcUrl: RPC_URL,
    nftContractAddress: NFT_CONTRACT_ADDRESS,
    userAddress: address,
    abi: nftAbi,
  })

  const handleOpenModal = (nft: any) => {
    setSelectedNFT(nft)
    onOpen()
  }

  return (
    <HStack align="start" spacing={8} p={6}>
      {/* Sidebar */}
      <VStack align="start" spacing={4} minW="200px" mt={2}>
        <Heading size="md">🖼️ My NFTs</Heading>
        <Divider />
        {navLinks.map((link) => (
          <ChakraLink
            key={link.href}
            as={Link}
            to={link.href}
            fontWeight="medium"
            _hover={{ color: 'blue.400' }}
            color={link.href === '/account/nfts' ? 'blue.500' : undefined}
          >
            {link.label}
          </ChakraLink>
        ))}
      </VStack>

      {/* Main Content */}
      <Box flex="1">
        <Heading mb={4}>🖼️ My NFTs</Heading>

        {loading && <Spinner />}
        {error && <Text color="red.500">Error loading NFTs: {error}</Text>}
        {!loading && !error && nfts.length === 0 && (
          <Text>No NFTs found for this address.</Text>
        )}

        <VStack align="start" spacing={4}>
          {nfts.map((nft) => (
            <Box
              key={nft.tokenId}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              w="100%"
              bg="white"
              _hover={{ shadow: 'md', cursor: 'pointer' }}
              onClick={() => handleOpenModal(nft)}
            >
              <HStack spacing={4}>
                <Image
                  src={resolveImageUri(nft.metadata?.image)}
                  alt={nft.metadata?.name || 'NFT'}
                  fallbackSrc="/placeholder.png"
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">
                    {nft.metadata?.name || `Token #${nft.tokenId}`}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {nft.metadata?.description || 'No description available'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Token ID: {nft.tokenId}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Modal for NFT details */}
        {selectedNFT && (
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {selectedNFT.metadata?.name || `Token #${selectedNFT.tokenId}`}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="start" spacing={4}>
                  <Image
                    src={resolveImageUri(selectedNFT.metadata?.image)}
                    alt="NFT Image"
                    fallbackSrc="/placeholder.png"
                    borderRadius="md"
                    maxH="300px"
                    objectFit="contain"
                    mx="auto"
                  />
                  <Text>
                    <strong>Description:</strong>{' '}
                    {selectedNFT.metadata?.description || 'No description'}
                  </Text>
                  <Text>
                    <strong>Token ID:</strong> {selectedNFT.tokenId}
                  </Text>
                  <Text>
                    <strong>Metadata URI:</strong>{' '}
                    <ChakraLink href={selectedNFT.metadataUri} isExternal color="blue.500">
                      {selectedNFT.metadataUri}
                    </ChakraLink>
                  </Text>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </HStack>
  )
}
