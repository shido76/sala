import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import Scheduling from '../../models/scheduling.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';

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
    
    user = await new User(userData).create();
    location = await new Location(locationData).create();
    
    this.data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00",
      endAt: "2023-09-30T20:00:00",
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
    const scheduling = await new Scheduling(this.data).create();
    expect(scheduling).toBeTruthy();
  }),

  it('should not save if description not present', async () => {
    const data = {
      description: "",
      startAt: "2023-09-30T19:00:00",
      endAt: "2023-09-30T20:00:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling(data);
    await scheduling.isValid();
    expect(scheduling.error['base']['description']['_errors']).toContain('Required Description');
  }),

  it('should not save if startAt is invalid', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "",
      endAt: "2023-09-30T20:00:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling(data);
    await scheduling.isValid();
    expect(scheduling.error['base']['startAt']['_errors']).toContain('Invalid startAt');
  }),

  it('should not save if endAt is invalid', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00",
      endAt: "",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling(data);
    await scheduling.isValid();
    expect(scheduling.error['base']['endAt']['_errors']).toContain('Invalid endAt');
  }),

  it('should not save if userId not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00",
      endAt: "2023-09-30T20:00:00",
      userId: '',
      locationId: location.id,
    };

    const scheduling = new Scheduling(data);
    await scheduling.isValid();
    expect(scheduling.error['base']['userId']['_errors']).toContain('Required UserId');
  }),

  it('should not save if locationId not present', async () => {
    const data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00",
      endAt: "2023-09-30T20:00:00",
      userId: user.id,
      locationId: '',
    };

    const scheduling = new Scheduling(data);
    await scheduling.isValid();
    expect(scheduling.error['base']['locationId']['_errors']).toContain('Required LocationId');
  }),

  it('should throw exception if data is invalid', async () => {
    const data = {
      description: "",
      startAt: "2023-09-30T19:00:00",
      endAt: "2023-09-30T20:00:00",
      userId: user.id,
      locationId: location.id,
    };

    const scheduling = new Scheduling(data);
    await expect(() => scheduling.create()).rejects.toThrowError('Required Description');
  }),

  it('should retrieve all schedulings', async () => {
    let schedulings = await Scheduling.findAll();
    expect(schedulings.length).toEqual(0);

    const scheduling = new Scheduling(this.data);
    await scheduling.create();

    schedulings = await Scheduling.findAll();
    expect(schedulings.length).toEqual(1);
  }),

  it('should delete a scheduling', async () => {
    const scheduling = await new Scheduling(this.data).create();
    await Scheduling.destroy(scheduling.id);

    const schedulings = await Scheduling.findAll();
    expect(schedulings.length).toEqual(0);
  }),

  it('should retrieve a scheduling', async () => {
    const scheduling = await new Scheduling(this.data).create();
    const schedulingRetrieved = await Scheduling.find(scheduling.id);
    expect(schedulingRetrieved.id).toEqual(scheduling.id);
  }),

  it('should update a scheduling', async () => {
    const data = { 
      description: "Evento Arcadas",
      startAt: "2023-10-01T10:00:00",
      endAt: "2023-10-01T11:00:00",
    };
    const scheduling = await new Scheduling(this.data).create();
    const schedulingRetrieved = await new Scheduling(data).update(scheduling.id);
    expect(schedulingRetrieved.description).toEqual("Evento Arcadas");
    expect(schedulingRetrieved.startAt).toEqual(new Date("2023-10-01T10:00:00"));
    expect(schedulingRetrieved.endAt).toEqual(new Date("2023-10-01T11:00:00"));
  }),

  it('should not update if description not present', async () => {
    const scheduling = await new Scheduling(this.data).create();
    await expect(() => new Scheduling({ description: "" }).update(scheduling.id)).rejects.toThrowError('Required Description');
  })
})
