import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import app from '../../app.js';
import User from '../../models/user.js';

describe('UserSession controller', () => {
  beforeAll(async () => {
    const data = {
      email: "fdescartes@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678",
      profiles: ['admin', 'manager', 'user'],
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
        email: 'fdescartes@test.com',
        password: '123456'
      });
    expect(response.status).toBe(200);
  }),

  it('should not authenticate with success if email or password are incorrect', async () => {
    const response = await request(app)
      .post('/session')
      .send({
        email: 'fdescartes@test.com',
        password: '1234567890'
      })
    expect(response.status).toBe(401);
  }),

  it('should renovate with success', async () => {
    const authResponse = await request(app)
      .post('/session')
      .send({
        email: 'fdescartes@test.com',
        password: '123456'
      });

    const cookie = authResponse.get('Set-Cookie')
    const response = await request(app)
      .post('/session/renovate')
      .set('Cookie', cookie)
      .send() 
      
    expect(response.status).toBe(200);
  }),

  it('should not renovate with if cookie is invalid', async () => {
    const response = await request(app)
      .post('/session/renovate')
      .set('Cookie', 'invalid')
      .send()
    expect(response.status).toBe(406);
  })
})