import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react'
import {
  FaGoogle,
  FaTwitter,
  FaDiscord,
  FaInstagram,
} from 'react-icons/fa'

interface SocialLoginButtonProps {
  provider: 'google' | 'twitter' | 'discord' | 'instagram'
  onClick?: () => void
}

const iconMap = {
  google: FaGoogle,
  twitter: FaTwitter,
  discord: FaDiscord,
  instagram: FaInstagram,
}

export function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const { colorMode } = useColorMode()
  const Icon = iconMap[provider]
  const displayName = provider.charAt(0).toUpperCase() + provider.slice(1)

  return (
    <Tooltip label={`Continue with ${displayName}`} hasArrow>
      <IconButton
        aria-label={`Continue with ${displayName}`}
        icon={<Icon />}
        variant="ghost"
        // Use gold color scheme in dark mode, blue otherwise
        colorScheme={colorMode === 'dark' ? 'yellow' : 'blue'}
        size="lg"
        onClick={onClick ? onClick : () => console.log(`Login with ${provider}`)}
        _dark={{
          color: 'gold',
          _hover: { bg: 'gray.800' },
        }}
      />
    </Tooltip>
  )
}
