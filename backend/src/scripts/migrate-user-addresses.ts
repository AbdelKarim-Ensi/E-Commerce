import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const usersWithLegacyAddress = await prisma.user.findMany({
    where: {
      address: { not: null },
    },
    select: {
      id: true,
      address: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  });

  console.log(
    `${usersWithLegacyAddress.length} utilisateur(s) avec une adresse legacy trouvés.`,
  );

  let migrated = 0;
  let skipped = 0;

  for (const user of usersWithLegacyAddress) {
    const existingCount = await prisma.address.count({
      where: { userId: user.id },
    });
    if (existingCount > 0) {
      skipped++;
      continue;
    }

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      'Adresse principale';

    await prisma.address.create({
      data: {
        userId: user.id,
        label: 'Principale',
        fullName,
        phone: user.phone ?? undefined,
        line1: user.address!.slice(0, 500), // valeur legacy brute, non structurée
        city: '—', // inconnu à partir du champ legacy, à corriger manuellement si besoin
        isDefault: true,
      },
    });
    migrated++;
  }

  console.log(
    `Migration terminée : ${migrated} adresse(s) créée(s), ${skipped} utilisateur(s) déjà migré(s) ignoré(s).`,
  );
}

main()
  .catch((err) => {
    console.error('Erreur pendant la migration :', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
