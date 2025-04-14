import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteDuplicateTAs() {
  const allTAs = await prisma.tA.findMany({
    orderBy: { id: 'asc' },
  })

  const seen = new Map()
  const duplicates: number[] = []

  for (const ta of allTAs) {
    const key = `${ta.name.toLowerCase()}-${ta.department.toLowerCase()}-${ta.schoolId}`
    if (seen.has(key)) {
      duplicates.push(ta.id)
    } else {
      seen.set(key, ta.id)
    }
  }

  for (const id of duplicates) {
    await prisma.review.deleteMany({ where: { taId: id } }) // delete dependent reviews first
    await prisma.tA.delete({ where: { id } })
    console.log(`Deleted duplicate TA with ID: ${id}`)
  }

  console.log(`✅ Deleted ${duplicates.length} duplicate TA(s).`)
}

deleteDuplicateTAs()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
