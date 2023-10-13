import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import UserPolicy from '../../policies/location.js';
import User from '../../models/user.js';

let normalUser;
let managerUser;
let adminUser;

describe('User policy', () => {
  beforeAll(async () => {
    let data = {
      email: "fdescartes-admin@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "1265562",
      phone: "(11) 91234-5678",
      profiles: ['admin', 'manager', 'user'],
    };
    adminUser = await new User(data).create();

    data = {
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

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({}),
      ]);
      await prisma.$disconnect();
    }
  })

  it('CREATE - grants access if user has manager profile', () => {
    expect(new UserPolicy(managerUser, normalUser).can('create')).toBe(true)
  })

  it('CREATE - denies access if user has not manager profile', () => {
    expect(new UserPolicy(normalUser, normalUser).can('create')).toBe(false)
  })

  it('UPDATE - grants access if user has manager profile', () => {
    expect(new UserPolicy(managerUser, normalUser).can('update')).toBe(true)
  })

  it('UPDATE - denies access if user has not manager profile', () => {
    expect(new UserPolicy(normalUser, normalUser).can('update')).toBe(false)
  })

  it('DESTROY - grants access if user has manager profile', () => {
    expect(new UserPolicy(managerUser, normalUser).can('destroy')).toBe(true)
  })

  it('DESTROY - denies access if user has not manager profile', () => {
    expect(new UserPolicy(normalUser, normalUser).can('destroy')).toBe(false)
  })

  it('SHOW - grants access if user has manager profile', () => {
    expect(new UserPolicy(managerUser, normalUser).can('show')).toBe(true)
  })
})