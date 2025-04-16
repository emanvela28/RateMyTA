import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'json-to-csv_.csv');

  const schools: { name: string; location: string; domain: string }[] = [];
  const seenDomains = new Set();

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const name = row['name']?.trim();
      const domain = row['domains/0']?.trim(); // ✅ this is the primary domain
      const state = row['state-province']?.trim();
      const country = row['country']?.trim();

      if (name && domain && country === 'United States' && !seenDomains.has(domain)) {
        seenDomains.add(domain);

        const location = state || 'USA';
        schools.push({ name, location, domain });

        if (schools.length <= 5) {
          console.log('📘 Preview school:', { name, location, domain });
        }
      }
    })
    .on('end', async () => {
      console.log(`📊 Parsed ${schools.length} U.S. schools from CSV`);

      if (schools.length === 0) {
        console.error('❌ No valid schools found.');
        await prisma.$disconnect();
        return;
      }

      try {
        console.log('🧹 Deleting old schools...');
        await prisma.school.deleteMany();

        console.log('📥 Inserting new schools...');
        for (const school of schools) {
          try {
            await prisma.school.create({ data: school });
            console.log(`✅ Added: ${school.name}`);
          } catch (error) {
            console.error(`❌ Error adding ${school.name}:`, error);
          }
        }

        console.log('🎉 School seeding completed!');
      } catch (e) {
        console.error('🔥 Seeding error:', e);
      } finally {
        await prisma.$disconnect();
      }
    });
}

main().catch((e) => {
  console.error('💥 Unhandled error:', e);
  prisma.$disconnect();
  process.exit(1);
});
