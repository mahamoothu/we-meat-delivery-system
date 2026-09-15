import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting development seed for WeMeat...');

  // 1. Seed Sample Customer User
  const customer = await prisma.user.upsert({
    where: { phoneNumber: '+910000000001' },
    update: {},
    create: {
      id: 'd1000000-0000-0000-0000-000000000001',
      phoneNumber: '+910000000001',
      name: 'Sample Customer',
      role: UserRole.CUSTOMER,
      isActive: true,
    },
  });

  // 2. Seed Sample Shop Owner User
  const shopOwner = await prisma.user.upsert({
    where: { phoneNumber: '+910000000002' },
    update: {},
    create: {
      id: 'd1000000-0000-0000-0000-000000000002',
      phoneNumber: '+910000000002',
      name: 'Sample Shop Owner',
      role: UserRole.SHOP_OWNER,
      isActive: true,
    },
  });

  // 3. Seed Sample Admin User
  await prisma.user.upsert({
    where: { phoneNumber: '+910000000003' },
    update: {},
    create: {
      id: 'd1000000-0000-0000-0000-000000000003',
      phoneNumber: '+910000000003',
      name: 'Sample Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  // 4. Seed Sample Shop
  const shop = await prisma.shop.upsert({
    where: { id: 'e1000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'e1000000-0000-0000-0000-000000000001',
      ownerId: shopOwner.id,
      name: 'WeMeat Fresh Cuts — Central Store',
      phoneNumber: '+910000000002',
      address: '123 Market Street, City Center',
      isActive: true,
    },
  });

  // 5. Seed Sample Products
  await prisma.product.upsert({
    where: { id: 'f1000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'f1000000-0000-0000-0000-000000000001',
      shopId: shop.id,
      name: 'Fresh Curry Cut Meat',
      description: 'Clean cut, tender fresh meat portions ready for cooking.',
      price: 220.0,
      imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
      isAvailable: true,
    },
  });

  await prisma.product.upsert({
    where: { id: 'f1000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'f1000000-0000-0000-0000-000000000002',
      shopId: shop.id,
      name: 'Boneless Breast Fillets',
      description: 'Premium quality tender boneless cuts.',
      price: 320.0,
      imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
      isAvailable: true,
    },
  });

  console.log('✅ Seed completed successfully with sample data.');
  console.log(
    `   Users: Customer (${customer.phoneNumber}), Shop Owner (${shopOwner.phoneNumber})`,
  );
  console.log(`   Shop: ${shop.name}`);
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
