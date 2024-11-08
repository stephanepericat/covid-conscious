import { PrismaClient as BasePrismaClient } from '@prisma/client'
// import { beforeEach } from 'vitest'
import { mockDeep /*, mockReset */ } from 'vitest-mock-extended'

// beforeEach(() => {
//   mockReset(prismaMock)
// })

const PrismaClient = mockDeep(BasePrismaClient)
export { PrismaClient }
