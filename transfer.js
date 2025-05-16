const { PrismaClient: SQLiteClient } = require('./generated/sqlite');
const { PrismaClient: PostgresClient } = require('./generated/postgres');

const sqlite = new SQLiteClient();
const postgres = new PostgresClient();

async function main() {
  // Transfer schools
  const schools = await sqlite.school.findMany();
  for (const school of schools) {
    await postgres.school.create({ data: school });
  }

  // Transfer users
  const users = await sqlite.user.findMany({ include: { accounts: true, sessions: true, reviews: true } });
  for (const user of users) {
    await postgres.user.create({
      data: {
        ...user,
        accounts: { create: user.accounts },
        sessions: { create: user.sessions },
      },
    });
  }

  // Transfer TAs
  const tas = await sqlite.tA.findMany();
  for (const ta of tas) {
    await postgres.tA.create({ data: ta });
  }

  // Transfer Reviews
  const reviews = await sqlite.review.findMany();
  for (const review of reviews) {
    await postgres.review.create({ data: review });
  }

  // Transfer SiteReviews
  const siteReviews = await sqlite.siteReview.findMany();
  for (const sr of siteReviews) {
    await postgres.siteReview.create({ data: sr });
  }

  // Transfer Reports
  const reports = await sqlite.report.findMany();
  for (const report of reports) {
    await postgres.report.create({ data: report });
  }

  console.log('✅ Transfer complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  });
