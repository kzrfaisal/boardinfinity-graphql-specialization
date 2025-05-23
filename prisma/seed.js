const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { id: '11', email: 'alice@example.com', gender: 'FEMALE' },
      { id: '12', email: 'bob@example.com', gender: 'MALE' },
    ],
  });

  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main().finally(() => prisma.$disconnect());
