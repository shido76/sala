import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import app from '../../app.js';
import User from '../../models/user.js';

const prisma = new PrismaClient();
let token;

describe('Location controller', () => {
  beforeAll(async () => {
    const data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };
    await new User().create(data);
    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@gmail.com', password: '123456' });
    token = response.body.token;

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('should list locations', async () => {
    const response = await request(app)
      .get('/locations')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('should not list locations if location not authenticated', async () => {
    const response = await request(app)
      .get('/locations');
    expect(response.status).toBe(401);
  }),

  it('should create location', async () => {
    const data = {
      name: "Teste",
      capacity: 100,
    };

    const response = await request(app)
      .post('/locations')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(201);
  }),

  it('should not create location if location already exists', async () => {
    const data = {
      name: "Teste",
      capacity: 100,
    };

    const response = await request(app)
      .post('/locations')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
      
    expect(response.status).toBe(209);
  })
})