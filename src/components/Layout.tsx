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
import DarkModeToggle from './DarkModeToggle'
import { NavLink, Outlet } from 'react-router-dom'
import logo1 from '../../public/logo1.png'
import { Link as RouterLink } from 'react-router-dom'
import { keyframes } from '@emotion/react'


const navLinks = [
  { label: 'Products', to: '/products' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Company', to: '/company' },
  { label: 'Resources', to: '/resources' },
  { label: 'DevTools', to: '/devTools' },
  { label: 'SDKs', to: '/sdks' },
]

// Keyframes for floating and pulsing animation
const floatPulse = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
    box-shadow: 0 0 30px 15px rgba(255, 215, 0, 0.6);
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 1;
    box-shadow: 0 0 50px 25px rgba(255, 215, 0, 1);
  }
`

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bg = useColorModeValue('gray.100', 'gray.900')
  const textColor = useColorModeValue('gray.800', '#FFD700')
  const linkHover = useColorModeValue('yellow.600', 'yellow.400')

  return (
    <Box minH="100vh" bg={bg} color={textColor} position="relative" overflow="hidden">
      
      {/* Glowing blobs background */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        pointerEvents="none"
        zIndex={-1}
        overflow="hidden"
      >
        {/* Each blob */}
        <Box
          position="absolute"
          bg="rgba(255, 215, 0, 0.3)"
          w="180px"
          h="180px"
          borderRadius="full"
          filter="blur(60px)"
          top="10%"
          left="15%"
          animation={`${floatPulse} 6s ease-in-out infinite`}
          transitionDelay="0s"
        />
        <Box
          position="absolute"
          bg="rgba(255, 215, 0, 0.2)"
          w="250px"
          h="250px"
          borderRadius="full"
          filter="blur(70px)"
          top="50%"
          left="70%"
          animation={`${floatPulse} 8s ease-in-out infinite`}
          transitionDelay="2s"
        />
        <Box
          position="absolute"
          bg="rgba(255, 215, 0, 0.25)"
          w="200px"
          h="200px"
          borderRadius="full"
          filter="blur(50px)"
          top="75%"
          left="30%"
          animation={`${floatPulse} 7s ease-in-out infinite`}
          transitionDelay="4s"
        />
        <Box
          position="absolute"
          bg="rgba(255, 215, 0, 0.15)"
          w="300px"
          h="300px"
          borderRadius="full"
          filter="blur(90px)"
          top="30%"
          left="80%"
          animation={`${floatPulse} 9s ease-in-out infinite`}
          transitionDelay="1s"
        />
      </Box>

      {/* HEADER */}
      <Box
        as="header"
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
        position="relative"
        zIndex={1}
      >
        <Flex align="center" justify="space-between">
          <HStack spacing={2} alignItems="center">
            <Link
              as={RouterLink}
              to="/"
              _focus={{ boxShadow: 'none' }}
              display="flex"
              alignItems="center"
            >
              <Image
                src={logo1}
                alt="CypherVerseLabs logo"
                boxSize="40px"
                filter="drop-shadow(0 0 4px rgba(255, 215, 0, 0.7))"
                _hover={{ filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 1))' }}
                transition="filter 0.3s ease"
              />
            </Link>
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
                transition="color 0.2s ease"
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
              colorScheme="yellow"
              variant="solid"
              size="sm"
              aria-label="Login"
            >
              Login
            </Button>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open menu"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="ghost"
              _hover={{ bg: useColorModeValue('yellow.100', 'yellow.700') }}
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
                  transition="color 0.2s ease"
                >
                  {label}
                </Link>
              ))}
              <Button
                as={NavLink}
                to="/login"
                colorScheme="yellow"
                variant="solid"
                size="md"
                onClick={onClose}
                aria-label="Login"
              >
                Login
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box as="main" p={6} position="relative" zIndex={1}>
        <Outlet />
      </Box>

      {/* FOOTER */}
      <Box
        as="footer"
        px={6}
        py={10}
        borderTop="1px solid"
        borderColor={useColorModeValue('gray.300', 'gray.700')}
        position="relative"
        zIndex={1}
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
