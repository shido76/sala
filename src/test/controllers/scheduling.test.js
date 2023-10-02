import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import app from '../../app.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';

const prisma = new PrismaClient();
let token;
let dataScheduling;

describe('Scheduling controller', () => {
  beforeAll(async () => {
    const userData = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };

    const locationData = {
      name: "Teste",
      capacity: 100,
    };

    const user = await new User().create(userData);
    const location = await new Location().create(locationData);

    dataScheduling = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@gmail.com', password: '123456' });
    token = response.body.token;

    return async () => {
      await prisma.$transaction([
        prisma.scheduling.deleteMany({}),
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('should list schedulings', async () => {
    const response = await request(app)
      .get('/schedulings')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('should not list schedulings if scheduling not authenticated', async () => {
    const response = await request(app)
      .get('/schedulings');
    expect(response.status).toBe(401);
  }),

  it('should create scheduling', async () => {
    const response = await request(app)
      .post('/schedulings')
      .set('Authorization', `Bearer ${token}`)
      .send(dataScheduling);
    expect(response.status).toBe(201);
  }),

  it.skip('should not create scheduling if scheduling already exists', async () => {
    const response = await request(app)
      .post('/schedulings')
      .set('Authorization', `Bearer ${token}`)
      .send(dataScheduling);
    expect(response.status).toBe(209);
  })
})