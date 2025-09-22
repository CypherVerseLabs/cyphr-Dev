import { Link, Box } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <Box
      mt={8}
      pt={4}
      borderTop="1px solid"
      borderColor="gray.200"
      _dark={{
        borderColor: 'gray.700',
        bg: 'black',
        color: 'gold',
      }}
      color="gray.500"
      textAlign="center"
      fontSize="xs"
    >
      <Link
        href="https://github.com/CypherVerseLabs"
        isExternal
        display="inline-flex"
        alignItems="center"
        gap={1}
        color="gray.500"
        _dark={{ color: 'gold' }}
        _hover={{ textDecoration: 'underline' }}
      >
         🔗 Powered by | <FaGithub /><strong>CypherVerseLabs</strong>
      </Link>
    </Box>
  )
}
