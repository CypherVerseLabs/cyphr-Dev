import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react'
import {
  FaGoogle,
  FaTwitter,
  FaDiscord,
  FaInstagram,
} from 'react-icons/fa'

interface SocialLoginButtonProps {
  provider: 'google' | 'twitter' | 'discord' | 'instagram'
  onError?: (message: string) => void
  onSuccess?: (provider: string) => void
  onStart?: () => void
  onFinish?: () => void
}

const iconMap = {
  google: FaGoogle,
  twitter: FaTwitter,
  discord: FaDiscord,
  instagram: FaInstagram,
}

export function SocialLoginButton({
  provider,
  onError,
  onSuccess,
  onStart,
  onFinish,
}: SocialLoginButtonProps) {
  const { colorMode } = useColorMode()
  const Icon = iconMap[provider]
  const displayName = provider.charAt(0).toUpperCase() + provider.slice(1)

  const handleClick = async () => {
    try {
      onStart?.()  // Notify start of login

      // Simulate async OAuth login process (replace with real logic)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // fake 1s delay

      // On success
      onSuccess?.(provider)
    } catch (error: any) {
      const msg = error?.message || `OAuth failed for ${provider}`
      onError?.(msg)
    } finally {
      onFinish?.() // Notify finish (success or error)
    }
  }

  return (
    <Tooltip label={`Continue with ${displayName}`} hasArrow>
      <IconButton
        aria-label={`Continue with ${displayName}`}
        icon={<Icon />}
        variant="ghost"
        colorScheme={colorMode === 'dark' ? 'yellow' : 'blue'}
        size="lg"
        onClick={handleClick}
        _dark={{
          color: 'gold',
          _hover: { bg: 'gray.800' },
        }}
      />
    </Tooltip>
  )
}
