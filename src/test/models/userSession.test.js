import { PrismaClient } from '@prisma/client';
import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import User from '../../models/user.js';
import UserSession from '../../models/userSession.js';

const prisma = new PrismaClient();

describe('user session', () => {
  beforeAll(async () => {
    this.data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };

    const user = new User();
    await user.create(this.data);

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  }),

  it('should authenticate user if email and password are correct', async () => {
    const userSession = await new UserSession(this.data['email'], this.data['password']);
    const token = await userSession.authenticate();
    expect(token).toBeTruthy();
  }),

  it('should not authenticate user if email is incorrect', async () => {
    const userSession = await new UserSession('tt@tt.com', this.data['password']);
    const token = await userSession.authenticate();
    expect(token).toBeFalsy();
  }),

  it('should not authenticate user if password is incorrect', async () => {
    const userSession = await new UserSession(this.data['email'], 'qqqqqq');
    const token = await userSession.authenticate();
    expect(token).toBeFalsy();
  }),

  it('should not authenticate user if email absent', async () => {
    const userSession = await new UserSession(this.data['email'], '');
    const token = await userSession.authenticate();
    expect(token).toBeFalsy();
  }),

  it('should not authenticate user if email absent', async () => {
    const userSession = await new UserSession('', this.data['password']);
    const token = await userSession.authenticate();
    expect(token).toBeFalsy();
  })
})