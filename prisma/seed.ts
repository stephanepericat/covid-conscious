const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.category.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: 'introduction'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      name: 'lifestyle'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 3,
    },
    update: {},
    create: {
      name: 'long-covid'
    }
  })


  await prisma.category.upsert({
    where: {
      id: 4,
    },
    update: {},
    create: {
      name: 'misc'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 5,
    },
    update: {},
    create: {
      name: 'products'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 6,
    },
    update: {},
    create: {
      name: 'recovery'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 7,
    },
    update: {},
    create: {
      name: 'relationships'
    }
  })

  await prisma.category.upsert({
    where: {
      id: 8,
    },
    update: {},
    create: {
      name: 'self-care'
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
