import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin Test',
      numusp: '123456',
      phone: '(11) 1234-5678',
      profiles: ['admin', 'manager', 'user'],
      passwordHash: '$2a$08$goBjF81msqf.vSt7cywqb.kjZ/RGZ7cEC0d7UOkLOHovkX9fjxmIG',
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@test.com' },
    update: {},
    create: {
      email: 'manager@test.com',
      name: 'Manager Test',
      numusp: '567890',
      phone: '(11) 1234-5678',
      profiles: ['manager', 'user'],
      passwordHash: '$2a$08$goBjF81msqf.vSt7cywqb.kjZ/RGZ7cEC0d7UOkLOHovkX9fjxmIG',
    },
  })

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@teste.com' },
    update: {},
    create: {
      email: 'user@teste.com',
      name: 'Normal User',
      numusp: '923452',
      phone: '(11) 1234-5678',
      profiles: ['user'],
      passwordHash: '$2a$08$goBjF81msqf.vSt7cywqb.kjZ/RGZ7cEC0d7UOkLOHovkX9fjxmIG',
    },
  })

  console.table([adminUser, managerUser, normalUser])

  const location1 = await prisma.location.upsert({
    where: { name: 'Anfiteatro I' },
    update: {},
    create: {
      name: 'Anfiteatro I',
      capacity: 100,
    },
  })

  const location2 = await prisma.location.upsert({
    where: { name: 'Anfiteatro II' },
    update: {},
    create: {
      name: 'Anfiteatro II',
      capacity: 200,
    },
  })

  console.table([location1, location2])

  const scheduling1 = await prisma.scheduling.upsert({
    where: { id: '1' },
    update: {},
    create: {
      description: 'Evento XI de Agosto',
      startAt: new Date('2023-10-09T10:00:00'),
        endAt: new Date('2023-10-09T11:00:00'),
      userId: adminUser.id,
      locationId: location1.id,
    },
  })

  const scheduling2 = await prisma.scheduling.upsert({
    where: { id: '1' },
    update: {},
    create: {
      description: 'Evento Arcadas',
      startAt: new Date('2023-10-10T10:00:00'),
        endAt: new Date('2023-10-10T11:00:00'),
      userId: adminUser.id,
      locationId: location1.id,
    },
  })

  console.table([scheduling1, scheduling2])
}

// npx prisma db seed

try {
  main()
} catch (error) {
  console.error(error)  
} finally {
  await prisma.$disconnect()
}