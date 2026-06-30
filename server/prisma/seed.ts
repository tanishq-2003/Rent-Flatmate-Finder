import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.interest.deleteMany();
  await prisma.compatibilityScore.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@rentfinder.com',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
      profile: {
        create: {
          name: 'System Admin',
        }
      }
    }
  });

  // Create owner
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@rentfinder.com',
      password: ownerPassword,
      role: Role.OWNER,
      isVerified: true,
      profile: {
        create: {
          name: 'John Owner',
          age: 40,
        }
      }
    }
  });

  // Create tenant
  const tenantPassword = await bcrypt.hash('tenant123', 10);
  const tenant = await prisma.user.create({
    data: {
      email: 'tenant@rentfinder.com',
      password: tenantPassword,
      role: Role.TENANT,
      isVerified: true,
      profile: {
        create: {
          name: 'Alice Tenant',
          age: 25,
          budgetMin: 500,
          budgetMax: 1500,
        }
      }
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
