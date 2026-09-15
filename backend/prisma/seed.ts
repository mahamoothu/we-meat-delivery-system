import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data (connectivity check)...');
  await prisma.healthRecord.create({
    data: {
      status: 'initialized',
    },
  });
  console.log('Seeding completed successfully.');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
