// pages/Home.tsx
import { Box, Button, Divider, Heading, HStack, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box maxW="7xl" mx="auto" py={16} px={{ base: 4, md: 8 }}>
      {/* Trusted By Section */}
      <VStack spacing={4} textAlign="center" mb={16}>
        <Heading size="lg" fontWeight="extrabold" color="purple.700">
          Trusted by the best teams
        </Heading>
        <Button
          colorScheme="purple"
          size="md"
          variant="outline"
          _hover={{ bg: 'purple.50' }}
          w="fit-content"
        >
          See Cyphr in action
        </Button>
      </VStack>

      {/* Build Section */}
      <Stack spacing={6} mb={16}>
        <Heading size="xl" fontWeight="extrabold" color="orange.600">
          Build
        </Heading>
        <Text fontSize="md" color="gray.700" maxW="3xl">
          Industry-leading framework for building blockchain apps. Secure wallet infrastructure, APIs to read and write to the blockchain, audited smart contracts, and deployment tools to start building your application.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={4}>
          <Feature title="Wallets" description="Wallet infrastructure and management for embedded and server wallets" />
          <Feature title="Transactions" description="Read and write API to perform blockchain transactions" />
          <Feature title="Contracts" description="Customizable tools to create, deploy and manage smart contracts" />
        </SimpleGrid>
      </Stack>

      <Divider />

      {/* Monetize Section */}
      <Stack spacing={6} mt={16} mb={16}>
        <Heading size="xl" fontWeight="extrabold" color="green.600">
          Monetize
        </Heading>
        <Text fontSize="md" color="gray.700" maxW="3xl">
          Earn revenue through payments and tokens. Create any token and list on a marketplace with industry-leading solutions for enabling crypto and fiat payments.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={4}>
          <Feature title="Payments" description="Payment solutions with ability to bridge, swap, and onramp crypto" />
          <Feature title="Tokens" description="Simple token creation tool for ERC20, ERC721, or ERC1155 for the app economy" />
          <Feature title="Marketplace" description="Primary and secondary sale of tokens for user-to-user trading" />
        </SimpleGrid>
      </Stack>

      <Divider />

      {/* Scale Section */}
      <Stack spacing={6} mt={16} mb={16}>
        <Heading size="xl" fontWeight="extrabold" color="blue.600">
          Scale
        </Heading>
        <Text fontSize="md" color="gray.700" maxW="3xl">
          Reliable and scalable infrastructure. Built-in reliable infrastructure so you can focus on building your app.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={4}>
          <Feature title="Account Abstraction" description="Enable gasless transactions and session permissioning" />
          <Feature title="Insight" description="Blockchain access to query and analyze data in your apps" />
          <Feature title="RPC" description="Reliable, high-performance access to blockchain networks" />
        </SimpleGrid>

        <Text fontSize="sm" mt={4} color="gray.500" fontStyle="italic">
          In any language on every platform.
        </Text>
      </Stack>

      <Divider />

      {/* Testimonials / Trusted */}
      <Stack spacing={12} mt={20} mb={20} maxW="5xl" mx="auto" textAlign="center">
        <Heading size="xl" fontWeight="extrabold" color="purple.700">
          Trusted by the best
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="4xl" mx="auto">
          Powering web3 apps across verticals — from onchain games to creator platforms.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Testimonial
            title="Safe"
            description="Integrated Cyphrwallet functionality to seamlessly onboard millions of users, serving as the largest multi-sig wallet tool in the world. Securing $100b+ in crypto assets."
          />
          <Testimonial
            title="King of Destiny"
            description="Launched collectible avatar NFTs using Cyphr Pay, providing a seamless user experience and accessibility for users at scale. 1,800 packs sold in under 2 minutes."
          />
          <Testimonial
            title="Coinbase"
            description="Bringing onchain experiences to the real world — with seamless NFT creation, delivery, & transaction management via the Coinbase Wallet app. 1000+ real world transactions."
          />
        </SimpleGrid>

        <Text fontSize="md" fontWeight="semibold" mt={8} color="gray.600">
          Build on any EVM chain — Our tools work with any contract deployed on any EVM-compatible chain.
        </Text>
      </Stack>

      <Divider />

      {/* Plans Section */}
      <Stack spacing={8} mt={20} mb={20} maxW="4xl" mx="auto" textAlign="center">
        <Heading size="xl" fontWeight="extrabold" color="orange.700">
          Plans that scale to every team
        </Heading>
        <Text color="gray.600" fontSize="md" maxW="3xl" mx="auto">
          Flexible and transparent pricing that scales to your app usage without cutting you off, ever.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mt={8}>
          <Plan name="Starter" price="$5 / month" description="Ideal for small teams who require basic features." />
          <Plan name="Growth" price="$99 / month" description="Most Popular — Ideal for scalable production-grade apps." popular />
          <Plan name="Scale" price="$499 / month" description="For funded startups and mid-size businesses." />
          <Plan name="Pro" price="Starting at $1,499 / month" description="For large organizations with custom needs." />
        </SimpleGrid>
      </Stack>

      <Divider />

      {/* Solutions Section */}
      <Stack spacing={8} maxW="5xl" mx="auto" textAlign="center" mt={20} mb={20}>
        <Heading size="xl" fontWeight="extrabold" color="purple.700">
          Solutions for every Web3 app
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mt={6}>
          <Solution title="Gaming" description="Native gaming SDKs to onboard & manage your players, craft a seamless player experience, and drive monetization." />
          <Solution title="Consumer Apps" description="Deliver seamless, secure, and decentralized digital experiences for users across any platform." />
          <Solution title="AI" description="Powerful API specialized for the blockchain. Query live data, analyze transactions, and prepare contract calls." />
        </SimpleGrid>
      </Stack>

      {/* Newsletter CTA */}
      <Box textAlign="center" mt={20} mb={16}>
        <Heading size="lg" mb={4} fontWeight="extrabold" color="orange.600">
          Sign-up for our newsletter.
        </Heading>
        <Text color="gray.600" mb={6}>
          Get the latest Web3 development news and updates.
        </Text>
        <Button colorScheme="purple" size="lg">
          Start with Cyphr — Get instant access
        </Button>
      </Box>
    </Box>
  )
}

// Helper components for repeated patterns:

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.3s">
      <Heading size="md" mb={2} color="purple.700">{title}</Heading>
      <Text color="gray.700" fontSize="sm">{description}</Text>
    </Box>
  )
}

function Testimonial({ title, description }: { title: string; description: string }) {
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" shadow="md" bg="purple.50" textAlign="left">
      <Heading size="md" mb={3} color="purple.800">{title}</Heading>
      <Text fontSize="sm" color="gray.700">{description}</Text>
    </Box>
  )
}

function Plan({ name, price, description, popular = false }: { name: string; price: string; description: string; popular?: boolean }) {
  return (
    <Box
      p={6}
      borderWidth="2px"
      borderColor={popular ? 'orange.400' : 'gray.200'}
      borderRadius="md"
      bg={popular ? 'orange.50' : 'white'}
      shadow={popular ? 'lg' : 'base'}
      textAlign="center"
      cursor="default"
    >
      <Heading size="lg" mb={2} color={popular ? 'orange.600' : 'gray.800'}>
        {name}
      </Heading>
      <Text fontWeight="bold" fontSize="2xl" mb={3} color={popular ? 'orange.700' : 'gray.900'}>
        {price}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {description}
      </Text>
    </Box>
  )
}

function Solution({ title, description }: { title: string; description: string }) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.3s">
      <Heading size="md" mb={2} color="purple.700">{title}</Heading>
      <Text color="gray.700" fontSize="sm">{description}</Text>
    </Box>
  )
}
