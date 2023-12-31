import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import LocationPolicy from '../../policies/location.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';

let location;
let normalUser;
let managerUser;

describe('Location policy', () => {
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

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('CREATE - grants access if user has manager profile', () => {
    const location = { name: "Anfiteatro XX", capacity: 100 };
    expect(new LocationPolicy(managerUser, location).can('create')).toBe(true)
  })

  it('CREATE - denies access if user has not manager profile', () => {
    const location = { name: "Anfiteatro XX", capacity: 100 };
    expect(new LocationPolicy(normalUser, location).can('create')).toBe(false)
  })

  it('UPDATE - grants access if user has manager profile', () => {
    expect(new LocationPolicy(managerUser, location).can('update')).toBe(true)
  })

  it('UPDATE - denies access if user has not manager profile', () => {
    expect(new LocationPolicy(normalUser, location).can('update')).toBe(false)
  })

  it('DESTROY - grants access if user has manager profile', () => {
    expect(new LocationPolicy(managerUser, location).can('destroy')).toBe(true)
  })

  it('DESTROY - denies access if user has not manager profile', () => {
    expect(new LocationPolicy(normalUser, location).can('destroy')).toBe(false)
  })

  it('SHOW - grants access if user has manager profile', () => {
    expect(new LocationPolicy(managerUser, location).can('show')).toBe(true)
  })
})