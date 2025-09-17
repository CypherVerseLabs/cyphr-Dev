import prisma from '../lib/prisma'

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      wallets: {
        create: {
          address: '0xabc123',
          walletType: 'embedded',
        },
      },
    },
  })

  console.log('Seeded user:', user)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())