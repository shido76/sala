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
    
    this.user = await new User({
      email: "fjs@usp.br",
      password: "123456",
      name: "Antonio XX",
      numusp: "52655651",
      phone: "(11) 98030-9205"
    }).create();

    const response = await request(app)
      .post('/session')
      .send({ email: 'fdescartes@gmail.com', password: '123456' });
    token = response.body.accessToken;

    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({})
      ]);
      await prisma.$disconnect();
    }
  })

  it('INDEX - should list users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('INDEX - should not list users if user not authenticated', async () => {
    const response = await request(app)
      .get('/users');
    expect(response.status).toBe(401);
  }),

  it('INDEX - should not list users if jwt is not valid', async () => {
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

  it('CREATE - should create user', async () => {
    const data = {
      email: "tt@tt.com",
      password: "123456",
      name: "Teste",
      numusp: "52655652",
      phone: "(11) 98030-9205"
    };

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(data.name);
  }),

  it('CREATE - should not create user if user already exists', async () => {
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
  }),

  it('SHOW - should retrieve user', async () => {
    const response = await request(app)
      .get(`/users/${this.user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(this.user.name);
  }),

  it('UPDATE - should update user', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "Antonio XX",
      numusp: "52655651",
      phone: "(11) 98030-9205"
    };
    const response = await request(app)
      .put(`/users/${this.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(data.description);
  }),

  it('UPDATE - should not update user', async () => {
    const response = await request(app)
      .put(`/users/${this.user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: "" });
    expect(response.status).toBe(209);
  }),

  it('DELETE - should delete user', async () => {
    const data = {
      email: "teste@tt.com",
      password: "123456",
      name: "Teste User",
      numusp: "123456",
      phone: "(11) 98030-9205"
    };
    const user = await new User(data).create();
    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }),

  it('DELETE - should not delete user', async () => {
    const response = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(209);
  })
})