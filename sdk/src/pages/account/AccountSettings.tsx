import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Link as ChakraLink,
  Divider,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'My Account', href: '/account' },
  { label: 'My Wallets', href: '/account/wallets' },
  { label: 'NFTs', href: '/account/nfts' },
  { label: 'Settings', href: '/account/settings' },
  { label: 'Devices', href: '/account/devices' },
]

export default function AccountSettings() {
  const toast = useToast()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load current user profile on mount (optional, if you have API for it)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/account', { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setDisplayName(data.displayName || '')
        setEmail(data.email || '')
        setAvatarUrl(data.avatarUrl || null)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error loading profile',
          description: 'Could not load your profile information.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    fetchProfile()
  }, [toast])

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    }
  }, [avatarUrl])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setAvatarFile(file)
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email)

  const canSave =
    displayName.trim().length > 0 && isValidEmail(email) && !isSaving && !isDeleting

  const handleSave = async () => {
    if (!canSave) return
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append('displayName', displayName)
      formData.append('email', email)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const res = await fetch('/api/account', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      const updatedProfile = await res.json()

      setDisplayName(updatedProfile.displayName)
      setEmail(updatedProfile.email)
      setAvatarUrl(updatedProfile.avatarUrl)

      setAvatarFile(null) // Clear the file since it's uploaded

      toast({
        title: 'Profile updated.',
        description: 'Your display name, email, and avatar have been saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (isDeleting) return
    if (
      window.confirm(
        'Are you sure you want to permanently delete your account? This action cannot be undone.'
      )
    ) {
      setIsDeleting(true)
      try {
        const res = await fetch('/api/account', {
          method: 'DELETE',
          credentials: 'include',
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Failed to delete account')
        }

        toast({
          title: 'Account deleted.',
          description:
            'Your account and all associated data have been permanently deleted.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })

        // Redirect user after account deletion
        window.location.href = '/'
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete account. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <HStack align="start" spacing={8} p={6}>
      {/* Sidebar Navigation */}
      <VStack align="start" spacing={4} minW="200px" mt={2}>
        <Heading size="md">⚙️ Account Settings</Heading>
        <Divider />
        {navLinks.map((link) => (
          <ChakraLink
            key={link.href}
            as={Link}
            to={link.href}
            fontWeight="medium"
            _hover={{ color: 'blue.400' }}
          >
            {link.label}
          </ChakraLink>
        ))}
      </VStack>

      {/* Settings Content */}
      <Box flex="1" maxW="600px">
        <Heading mb={4}>⚙️ Account Settings</Heading>
        <Text mb={6}>Manage your preferences, password, and profile here.</Text>

        <VStack spacing={6} align="stretch">
          {/* Display Name */}
          <FormControl>
            <FormLabel>Display Name</FormLabel>
            <Input
              placeholder="Enter display name"
              maxLength={32}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              This is your account's name displayed on thirdweb. Please use 32
              characters at maximum.
            </Text>
          </FormControl>

          {/* Avatar Upload */}
          <FormControl>
            <FormLabel>Avatar</FormLabel>
            <HStack spacing={4}>
              <Avatar size="lg" src={avatarUrl ?? undefined} />
              <Button as="label" cursor="pointer" colorScheme="blue">
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            </HStack>
            <Text fontSize="sm" color="gray.500" mt={1}>
              This is your account's avatar. Click on the avatar to upload a
              custom one. No file chosen.
            </Text>
          </FormControl>

          {/* Email Field */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              mt={2}
              colorScheme="blue"
              onClick={handleSave}
              isDisabled={!canSave}
              isLoading={isSaving}
            >
              Update Email & Profile
            </Button>
          </FormControl>

          {/* Delete Account */}
          <Box border="1px" borderColor="red.300" p={4} borderRadius="md">
            <Alert status="error" mb={3}>
              <AlertIcon />
              Permanently delete your cyph account, the default team
              "CypherVerseLabs", and all associated data. This action is not
              reversible.
            </Alert>
            <Button
              colorScheme="red"
              onClick={handleDeleteAccount}
              width="100%"
              isDisabled={isSaving || isDeleting}
              isLoading={isDeleting}
            >
              Delete Account
            </Button>
          </Box>
        </VStack>
      </Box>
    </HStack>
  )
}
