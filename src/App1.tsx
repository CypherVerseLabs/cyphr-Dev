import { useAccount, useDisconnect } from 'wagmi'
import WalletManager from '../sdk/src/components/WalletManager'
import WalletModal from '../sdk/components/WalletModal'
import { toast } from 'sonner'
import DarkModeToggle from '../sdk/components/DarkModeToggle'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Link,
  Text,
  useColorModeValue,
  VStack,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

function App() {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDisconnect = () => {
    disconnect()
    toast.success('Disconnected successfully.')
  }

  const shortenAddress = (addr?: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const bg = useColorModeValue('gray.100', 'black')
  const textColor = useColorModeValue('gray.800', 'gold')
  const accentColor = useColorModeValue('blue.500', 'yellow.400')
  const linkHover = useColorModeValue('blue.600', 'yellow.300')

  const navLinks = ['Products', 'Services', 'Pricing', 'Developer', 'Company', 'Contact Us']

  return (
    <Box minH="100vh" bg={bg} color={textColor}>
      {/* ===== HEADER ===== */}
      <Box as="header" px={6} py={4} borderBottom="1px solid" borderColor={useColorModeValue('gray.300', 'gray.700')}>
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Image src="/logo.png" alt="Logo" boxSize="36px" />
            <Heading size="md">CypherVerseLabs</Heading>
          </HStack>

          {/* Desktop Nav Links */}
          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                fontWeight="medium"
                _hover={{ color: linkHover, textDecoration: 'underline' }}
              >
                {link}
              </Link>
            ))}
          </HStack>

          <HStack spacing={4}>
            <DarkModeToggle />

            {/* Hamburger Button on Mobile */}
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
            />
          </HStack>
        </Flex>
      </Box>

      {/* ===== MOBILE DRAWER NAV ===== */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={bg} color={textColor}>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <Stack spacing={5}>
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  fontWeight="medium"
                  onClick={onClose}
                  _hover={{ color: linkHover }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* ===== MAIN SECTION ===== */}
      <Container maxW="container.md" py={12}>
        <VStack spacing={8} align="start">
          {!isConnected ? (
            <WalletModal />
          ) : (
            <VStack align="start" spacing={6} w="full">
              <Text>
                ✅ You're connected as{' '}
                <Text as="span" color={accentColor} fontWeight="bold">
                  {shortenAddress(address)}
                </Text>
              </Text>

              <Button onClick={handleDisconnect} colorScheme="red">
                Disconnect
              </Button>

              <WalletManager />
            </VStack>
          )}
        </VStack>
      </Container>

      {/* ===== FOOTER ===== */}
      <Box as="footer" px={6} py={10} borderTop="1px solid" borderColor={useColorModeValue('gray.300', 'gray.700')}>
        <Container maxW="container.lg">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'start', md: 'center' }}
            justify="space-between"
            gap={4}
          >
            <HStack spacing={6} wrap="wrap">
              {navLinks.map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  fontSize="sm"
                  _hover={{ color: linkHover, textDecoration: 'underline' }}
                >
                  {link}
                </Link>
              ))}
            </HStack>

            <Text fontSize="xs" color={textColor} mt={{ base: 4, md: 0 }}>
              🔗 Powered by{' '}
              <Link
                href="https://github.com/CypherVerseLabs"
                isExternal
                fontWeight="bold"
                _hover={{ color: linkHover }}
              >
                CypherVerseLabs
              </Link>
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default App
