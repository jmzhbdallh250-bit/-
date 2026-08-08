const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.matchPlayer.deleteMany();
  await prisma.match.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.playerCard.deleteMany();
  await prisma.mercatoPost.deleteMany();
  await prisma.user.deleteMany();

  const u1 = await prisma.user.create({ data: { email: 'ahmed@example.com', passwordHash: 'placeholder', displayName: 'Ahmed', avatarUrl: '', matchesPlayed: 12, goals: 20 }});
  const u2 = await prisma.user.create({ data: { email: 'mona@example.com', passwordHash: 'placeholder', displayName: 'Mona', avatarUrl: '', matchesPlayed: 5, goals: 2 }});

  await prisma.playerCard.createMany({
    data: [
      { userId: u1.id, stamina: 80, speed: 85, technique: 78 },
      { userId: u2.id, stamina: 70, speed: 72, technique: 80 }
    ]
  });

  const v1 = await prisma.venue.create({
    data: {
      name: 'ملعب حي الشرطة',
      area: 'حي الشرطة',
      type: 'SEVEN',
      images: ['/uploads/police_night.jpg'],
      isAvailable: true,
      capacity: 14
    }
  });
  const v2 = await prisma.venue.create({
    data: {
      name: 'ملاعب الكرامة',
      area: 'الكرامة',
      type: 'FIVE',
      images: ['/uploads/karama.jpg'],
      isAvailable: false,
      capacity: 10
    }
  });

  await prisma.mercatoPost.create({
    data: {
      teamName: 'فريق النسور',
      needed: ['GK','DEF'],
      message: 'نبحث عن حارس ومدافع لمباراة السبت',
      createdById: u1.id
    }
  });

  console.log('Seed finished');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
