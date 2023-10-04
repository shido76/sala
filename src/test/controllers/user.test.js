import request from 'supertest';
import { expect, describe, it, beforeAll } from 'vitest';
import { prisma } from '../../lib/prisma.js';
import app from '../../app.js';
import User from '../../models/user.js';

let token;

describe('User controller', () => {
  beforeAll(async () => {
    const data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };
    await new User(data).create();
    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@gmail.com', password: '123456' });
    token = response.body.token;

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('should list users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('should not list users if user not authenticated', async () => {
    const response = await request(app)
      .get('/users');
    expect(response.status).toBe(401);
  }),

  it('should not list users if jwt is not valid', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}XXX`);

    expect(response.status).toBe(401);
  }),

  it('should return not 404 if path not found', async () => {
    const response = await request(app)
      .get('/usersaa')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(404);
  }),

  it('should create user', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "52655651",
      phone: "(11) 98030-9205"
    };

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(201);
  }),

  it('should not create user if user already exists', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "52655651",
      phone: "(11) 98030-9205"
    };

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(209);
  })
})