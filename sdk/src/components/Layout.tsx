import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Heading,
  Link,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import DarkModeToggle from './WalletModal/DarkModeToggle'
import { NavLink, Outlet } from 'react-router-dom'
import WalletModal from './WalletModal/Modal'



const navLinks = [
  { label: 'Home', to: '/login' },
  { label: 'Wallets', to: '/account/wallets' },
  { label: 'Dashboard', to: '/account/dashboard' },
]

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bg = useColorModeValue('gray.100', 'black')
  const textColor = useColorModeValue('gray.800', '#FFD700')
  const linkHover = useColorModeValue('blue.600', 'yellow.300')

  return (
    <Box minH="100vh" bg={bg} color={textColor}>
      {/* HEADER */}
      <Box
        as="header"
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Image src="/logo.png" alt="CypherVerseLabs logo" boxSize="36px" />
            <Heading size="md">CypherVerseLabs</Heading>
          </HStack>

          <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                as={NavLink}
                to={to}
                fontWeight="medium"
                _hover={{ color: linkHover, textDecoration: 'underline' }}
                _activeLink={{ color: linkHover, textDecoration: 'underline', fontWeight: 'bold' }}
              >
                {label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={4}>
            <DarkModeToggle />
            <WalletModal />
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

      {/* MOBILE DRAWER */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} returnFocusOnClose>
        <DrawerOverlay />
        <DrawerContent bg={bg} color={textColor}>
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <Stack spacing={5}>
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  as={NavLink}
                  to={to}
                  fontWeight="medium"
                  onClick={onClose}
                  _hover={{ color: linkHover }}
                  _activeLink={{ color: linkHover, fontWeight: 'bold' }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box as="main" p={6}>
        <Outlet />
      </Box>

      {/* FOOTER */}
      <Box
        as="footer"
        px={6}
        py={10}
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
      >
        <Box maxW="container.lg" mx="auto" textAlign="center" fontSize="sm" color={textColor}>
          🔗 Powered by{' '}
          <Link
            href="https://github.com/CypherVerseLabs"
            isExternal
            fontWeight="bold"
            _hover={{ color: linkHover }}
          >
            CypherVerseLabs
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
