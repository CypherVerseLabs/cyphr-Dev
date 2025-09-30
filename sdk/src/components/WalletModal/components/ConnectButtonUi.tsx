import { Button, ButtonProps } from '@chakra-ui/react'

interface ConnectButtonUIProps extends ButtonProps {
  onOpen: () => void
  isConnected: boolean
  displayName: string
  buttonText?: string
  isLoggingOut: boolean
  themeColor: string
  buttonTextColor?: string
}

export default function ConnectButtonUI({
  onOpen,
  isConnected,
  displayName,
  buttonText = 'Connect Wallet',
  isLoggingOut,
  themeColor,
  buttonTextColor,
  ...rest
}: ConnectButtonUIProps) {
  return (
    <Button
      onClick={onOpen}
      bg={themeColor}
      color={buttonTextColor}
      isLoading={isLoggingOut}
      aria-label={isConnected ? `Connected wallet: ${displayName}` : 'Connect your wallet'}
      {...rest}
    >
      {isConnected ? displayName : buttonText}
    </Button>
  )
}
