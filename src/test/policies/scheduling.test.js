import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import SchedulingPolicy from '../../policies/scheduling.js';
import Location from '../../models/location.js';
import User from '../../models/user.js';
import Scheduling from '../../models/scheduling.js';

let location;
let scheduling1;
let scheduling2;
let normalUser;
let managerUser;

describe('Scheduling policy', () => {
  beforeAll(async () => {
    let data = {
      email: "fdescartes@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678",
      profiles: ['manager', 'user'],
    };
    managerUser = await new User(data).create();

    data = {
      email: "fjs@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "123456",
      phone: "(11) 91234-5678",
      profiles: ['user'],
    };
    normalUser = await new User(data).create();

    data = {
      name: "Anfiteatro X",
      capacity: 100
    };
    location = await new Location(data).create();

    data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: managerUser.id,
      locationId: location.id,
    };
    scheduling1 = await new Scheduling(data).create();

    data = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: normalUser.id,
      locationId: location.id,
    };
    scheduling2 = await new Scheduling(data).create();

    return async () => {
      await prisma.$transaction([
        prisma.scheduling.deleteMany({}),
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('CREATE - grants access if user has manager profile', () => {
    const scheduling = { name: "Anfiteatro X", capacity: 100 };
    expect(new SchedulingPolicy(managerUser, scheduling).can('create')).toBe(true)
  })

  it('CREATE - denies access if user has not manager profile', () => {
    const scheduling = { name: "Anfiteatro X", capacity: 100 };
    expect(new SchedulingPolicy(normalUser, scheduling).can('create')).toBe(false)
  })

  it('UPDATE - grants access if user has manager profile', () => {
    expect(new SchedulingPolicy(managerUser, scheduling1).can('update')).toBe(true)
  })

  it('UPDATE - denies access if user has not manager profile', () => {
    expect(new SchedulingPolicy(normalUser, scheduling1).can('update')).toBe(false)
  })

  it('DESTROY - grants access if user has manager profile', () => {
    expect(new SchedulingPolicy(managerUser, scheduling1).can('destroy')).toBe(true)
  })

  it('DESTROY - denies access if user has not manager profile', () => {
    expect(new SchedulingPolicy(normalUser, scheduling1).can('destroy')).toBe(false)
  })

  it('SHOW - grants access if user has manager profile', () => {
    expect(new SchedulingPolicy(managerUser, scheduling1).can('show')).toBe(true)
  })

})