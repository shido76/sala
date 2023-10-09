import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import User from '../../models/user.js';
import UserSession from '../../models/userSession.js';

describe('user session', () => {
  beforeAll(async () => {
    this.data = {
      email: "fdescartes@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    };

    const user = new User(this.data);
    await user.create();

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
  }),

  it('should retrieve refresh token', async () => {
    const userSession = await new UserSession(this.data['email'], this.data['password']);
    const token = await userSession.authenticate();
    const refreshToken = token[1];

    const renovatedToken = userSession.renovate(refreshToken);
    expect(renovatedToken.length).toEqual(2);
  }),

  it('should not retrieve refresh token if token is invalid', async () => {
    const userSession = await new UserSession(this.data['email'], this.data['password']);
    expect(userSession.renovate('fake')).toBeFalsy();
  })
})