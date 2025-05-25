const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const sampleUsers = Array.from({ length: 20 }).map((_, i) => ({
    id: String(i + 1).padStart(2, '0'),
    email: `user${i + 1}@example.com`,
    gender: 'OTHER',
  }));

  await prisma.user.createMany({ data: sampleUsers });
  console.log('✅ Seeded 20 users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
