import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import app from '../../app.js';
import User from '../../models/user.js';

describe('UserSession controller', () => {
  beforeAll(async () => {
    const data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };
    await new User(data).create();

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('should authenticate with success', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'fdescartes@gmail.com',
        password: '123456'
      })
    expect(response.status).toBe(200);
  }),

  it('should not authenticate with success if email or password are incorrect', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'fdescartes@gmail.com',
        password: '1234567'
      })
    expect(response.status).toBe(401);
  })
})