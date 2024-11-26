import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('testtest123', 10);

  await prisma.users.create({
    data: {
      userId: 'useruser',
      password: hashedPassword,
      customerGroup: '直販',
      roles: ['user']
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });