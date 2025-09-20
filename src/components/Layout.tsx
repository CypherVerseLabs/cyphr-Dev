import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  Button,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import DarkModeToggle from '../../sdk/src/components/WalletModal/DarkModeToggle'
import { NavLink, Outlet } from 'react-router-dom'
import logo1 from '../../public/logo1.png'

const navLinks = [
  { label: 'Products', to: '/products' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Company', to: '/company' },
  { label: 'Resources', to: '/resources' },
  { label: 'DevTools', to: '/devTools' },
  { label: 'SDKs', to: '/sdks' }
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
            <Image src={logo1} alt="CypherVerseLabs logo" boxSize="36px" />
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
            <Button
              as={NavLink}
              to="/login"
              colorScheme="teal"
              variant="solid"
              size="sm"
            >
              Login
            </Button>
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
              <Button
                as={NavLink}
                to="/login"
                colorScheme="teal"
                variant="solid"
                size="md"
                onClick={onClose}
              >
                Login
              </Button>
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
