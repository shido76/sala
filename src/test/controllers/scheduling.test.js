import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import app from '../../app.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';
import Scheduling from '../../models/scheduling.js';

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

    const user = await new User(userData).create();
    const location = await new Location(locationData).create();

    dataScheduling = {
      description: "Evento XI de Agosto",
      startAt: "2023-09-30T19:00:00-03:00",
      endAt: "2023-09-30T20:00:00-03:00",
      userId: user.id,
      locationId: location.id,
    };

    this.scheduling = await new Scheduling({ ...dataScheduling, description: "Evento 2" }).create();

    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@gmail.com', password: '123456' });
    token = response.body.accessToken;

    return async () => {
      await prisma.$transaction([
        prisma.scheduling.deleteMany({}),
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('INDEX - should list schedulings', async () => {
    const response = await request(app)
      .get('/schedulings')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('INDEX - should not list schedulings if scheduling not authenticated', async () => {
    const response = await request(app)
      .get('/schedulings');
    expect(response.status).toBe(401);
  }),

  it('CREATE - should create scheduling', async () => {
    const response = await request(app)
      .post('/schedulings')
      .set('Authorization', `Bearer ${token}`)
      .send(dataScheduling);
    expect(response.status).toBe(201);
    expect(response.body.description).toEqual(dataScheduling.description);
  }),

  it('CREATE - should not create scheduling if description not present', async () => {
    const data = { ...dataScheduling, description: "" };

    const response = await request(app)
      .post('/schedulings')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(209);
  }),

  it('SHOW - should retrieve scheduling', async () => {
    const response = await request(app)
      .get(`/schedulings/${this.scheduling.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(this.scheduling.description);
  }),

  it('UPDATE - should update scheduling', async () => {
    const response = await request(app)
      .put(`/schedulings/${this.scheduling.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dataScheduling);
    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(dataScheduling.description);
  }),

  it('UPDATE - should not update scheduling', async () => {
    const response = await request(app)
      .put(`/schedulings/${this.scheduling.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...dataScheduling, userId: 22 });
    expect(response.status).toBe(209);
  }),

  it('DELETE - should delete scheduling', async () => {
    const scheduling = await new Scheduling({ ...dataScheduling, description: "Evento 3" }).create();
    const response = await request(app)
      .delete(`/schedulings/${scheduling.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('DELETE - should not delete scheduling', async () => {
    const response = await request(app)
      .delete('/schedulings/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(209);
  })

})