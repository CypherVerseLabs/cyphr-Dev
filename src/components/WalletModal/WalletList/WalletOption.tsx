import React from 'react'
import {
  Button,
  Flex,
  Spinner,
  Text,
  Image,
} from '@chakra-ui/react'

interface WalletOptionProps {
  connector: any
  iconId?: string
  name?: string
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

const WalletOption: React.FC<WalletOptionProps> = ({
  connector,
  iconId,
  name,
  onClick,
  isLoading,
  disabled,
}) => {
  return (
    <Button
      onClick={onClick}
      isDisabled={disabled}
      variant="outline"
      width="100%"
      justifyContent="space-between"
    >
      <Flex align="center" gap={2}>
        {iconId && (
          <Image
            src={`/wallets/${iconId}.svg`}
            alt={`${name ?? connector.name} logo`}
            boxSize="20px"
          />
        )}
        <Text>{name ?? connector.name}</Text>
      </Flex>

      {isLoading && <Spinner size="sm" />}
    </Button>
  )
}

export default WalletOption
