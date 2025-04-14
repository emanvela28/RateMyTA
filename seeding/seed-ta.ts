// seed-ta.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const school = await prisma.school.findFirst({
    where: {
      name: {
        contains: 'Stanford', // change this to your favorite school name
      },
    },
  })

  if (!school) {
    console.log('No school found!')
    return
  }

  const ta = await prisma.tA.create({
    data: {
      name: 'Eman Vela',
      department: 'Computer Science',
      schoolId: school.id,
    },
  })

  console.log('✅ TA created:', ta)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
