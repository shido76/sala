import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import app from '../../app.js';
import User from '../../models/user.js';
import Location from '../../models/location.js';

let token;

describe('Location controller', () => {
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
    this.location = await new Location({ name: "Teste I", capacity: 100 }).create();

    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@test.com', password: '123456' });
    token = response.body.accessToken;

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({}),
        prisma.location.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('INDEX - should list locations', async () => {
    const response = await request(app)
      .get('/locations')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('INDEX - should not list locations if location not authenticated', async () => {
    const response = await request(app)
      .get('/locations');
    expect(response.status).toBe(401);
  }),

  it('CREATE - should create location', async () => {
    const data = {
      name: "Teste",
      capacity: 100,
    };

    const response = await request(app)
      .post('/locations')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(data.name);
  }),

  it('CREATE - should not create location if location already exists', async () => {
    const data = {
      name: "Teste",
      capacity: 100,
    };

    const response = await request(app)
      .post('/locations')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
      
    expect(response.status).toBe(209);
  }),

  it('SHOW - should retrieve location', async () => {
    const response = await request(app)
      .get(`/locations/${this.location.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(this.location.description);
  }),

  it('UPDATE - should update location', async () => {
    const dataLocation = { name: "Teste I", capacity: 100 }
    const response = await request(app)
      .put(`/locations/${this.location.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dataLocation);
    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(dataLocation.description);
  }),

  it('UPDATE - should not update location', async () => {
    const response = await request(app)
      .put(`/locations/${this.location.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "" });
    expect(response.status).toBe(209);
  }),

  it('DELETE - should delete location', async () => {
    const dataLocation = { name: "Teste II", capacity: 100 }
    const location = await new Location(dataLocation).create();
    const response = await request(app)
      .delete(`/locations/${location.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('DELETE - should not delete location', async () => {
    const response = await request(app)
      .delete('/locations/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(209);
  })
})