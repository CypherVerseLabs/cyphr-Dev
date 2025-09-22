// components/LogoutButton.tsx
import { Button } from '@chakra-ui/react'
import { useAuth } from '../../../../../sdk/src/hooks/useAuth'

export default function LogoutButton() {
  const { clearToken } = useAuth()

  return (
    <Button colorScheme="red" onClick={clearToken}>
      Logout
    </Button>
  )
}
