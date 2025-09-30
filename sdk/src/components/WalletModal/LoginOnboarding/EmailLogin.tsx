import { useState, useEffect } from 'react'
import { IconButton, Tooltip, useColorMode } from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'

interface SocialLoginButtonProps {
  provider: 'google'
  onError?: (message: string) => void
  onSuccess?: (provider: string, token: string) => void
  onStart?: () => void
  onFinish?: () => void
}

const iconMap = {
  google: FaGoogle,
}

// 👉 Update this URL with your actual OAuth endpoint and client ID
const oauthUrls: Record<string, string> = {
  google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=939387837885-2t69t118m5blfco7o73k0tgjql7bmfd0.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
    "http://localhost:3000/oauth-callback.html"
  )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent&state=google123`,
}

function openPopup(url: string, name: string, width = 500, height = 600) {
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2.5
  return window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
  )
}

export function EmailLogin({
  provider,
  onError,
  onSuccess,
  onStart,
  onFinish,
}: SocialLoginButtonProps) {
  const { colorMode } = useColorMode()
  const Icon = iconMap[provider]
  const displayName = provider.charAt(0).toUpperCase() + provider.slice(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const trustedOrigin = window.location.origin
      if (event.origin !== trustedOrigin) return

      const { provider: msgProvider, token, error } = event.data || {}

      if (!msgProvider || msgProvider !== provider) return

      if (token) {
        onSuccess?.(msgProvider, token)
      } else if (error) {
        onError?.(error)
      }
      setIsLoading(false)
      onFinish?.()
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [provider, onSuccess, onError, onFinish])

  const handleClick = () => {
    if (isLoading) return
    onStart?.()
    setIsLoading(true)

    const url = oauthUrls[provider]
    if (!url) {
      onError?.(`OAuth URL not configured for ${provider}`)
      setIsLoading(false)
      onFinish?.()
      return
    }

    const popup = openPopup(url, `${provider} Login`)

    const popupInterval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupInterval)
        if (isLoading) {
          onError?.('Popup closed before completing login')
          setIsLoading(false)
          onFinish?.()
        }
      }
    }, 500)
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
        isLoading={isLoading}
        _dark={{
          color: 'gold',
          _hover: { bg: 'gray.800' },
        }}
      />
    </Tooltip>
  )
}
