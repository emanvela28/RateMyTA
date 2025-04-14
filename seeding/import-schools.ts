import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const filePath = path.join(__dirname, 'schools.csv')

  const schools: { name: string; location: string }[] = []

  let lineCount = 0
  fs.createReadStream(filePath)
    .pipe(csv({ skipLines: 10 })) // 👈 SKIP the first 9 rows
    .on('data', (row) => {
      const name = row['INSTITUTION NAME']?.trim()
      const city = row['CITY']?.trim()
      const state = row['STATE (ABRV)']?.trim()

      if (name && city && state) {
        schools.push({ name, location: `${city}, ${state}` })
      }
    })
    .on('end', async () => {
      for (const school of schools) {
        try {
          await prisma.school.create({
            data: {
              name: school.name,
              location: school.location,
            },
          })
          console.log(`✅ Added: ${school.name}`)
        } catch (error) {
          console.error(`❌ Error adding ${school.name}:`, error)
        }
      }
      await prisma.$disconnect()
      console.log('🎉 Import completed.')
    })
}

main().catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
