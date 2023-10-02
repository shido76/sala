import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import app from '../../app.js';
import User from '../../models/user.js';

const prisma = new PrismaClient();

describe('UserSession controller', () => {
  beforeAll(async () => {
    const data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };
    await new User().create(data);

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