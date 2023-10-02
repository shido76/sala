import { PrismaClient } from '@prisma/client';
import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import Scheduling from '../../models/scheduling.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';

const prisma = new PrismaClient();

let user;
let location;

describe ('scheduling', () => {
  beforeAll(async () => {
    const userData = {
      email: "teste@test.com",
      password: "123456",
      name: "User Test",
      numusp: "123456",
      phone: "(11) 12345-6789"
    };
    
    const locationData = {
      name: "Sala 1",
      capacity: 100,
    }
    
    user = await new User().create(userData);
    location = await new Location().create(locationData);
    
    this.data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    return async () => {
      await prisma.$transaction([
        prisma.scheduling.deleteMany({}),
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  }),

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.scheduling.deleteMany({})
    ]);
  });

  it('should save', async () => {
    const scheduling = await new Scheduling().create(this.data);
    expect(scheduling).toBeTruthy();
  }),

  it('should not save if description not present', async () => {
    const data = {
      description: "",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['description']['_errors']).toContain('Required Description');
  }),

  it('should not save if startAt not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['startAt']['_errors']).toContain('Required startAt');
  }),

  it('should not save if startAt is invalid', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['startAt']['_errors']).toContain('Invalid startAt');
  }),

  it('should not save if endAt not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['endAt']['_errors']).toContain('Required endAt');
  }),

  it('should not save if endAt is invalid', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['endAt']['_errors']).toContain('Invalid endAt');
  }),

  it('should not save if userId not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: '',
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['userId']['_errors']).toContain('Required UserId');
  }),

  it('should not save if locationId not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: '',
    };

    const scheduling = new Scheduling();
    await scheduling.isValid(data);
    expect(scheduling.error['base']['locationId']['_errors']).toContain('Required LocationId');
  }),

  it('should throw exception if data is invalid', async () => {
    const data = {
      description: "",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling();
    await expect(() => scheduling.create(data)).rejects.toThrowError('Required Description');
  }),

  it('should retrieve all schedulings', async () => {
    let schedulings = await Scheduling.findAll();
    expect(schedulings.length).toEqual(0);

    const scheduling = new Scheduling();
    await scheduling.create(this.data);

    schedulings = await Scheduling.findAll();
    expect(schedulings.length).toEqual(1);
  })
})
