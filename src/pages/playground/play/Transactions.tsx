
import {CypherModal} from "../../../../sdk/src/components/ConnectModal";
import { useDisclosure } from '@chakra-ui/react'

export default function plTransactions() {
  const { onClose } = useDisclosure()

  return (
    <CypherModal
      forceOpen={true}    // Modal always open
      onForceClose={onClose}  // Allows closing the modal from inside
      hideButton={true}    // Hide the "Connect Wallet" button
    />
  )
}
