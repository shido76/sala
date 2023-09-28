import { PrismaClient } from '@prisma/client';
import { expect, describe, it, beforeEach } from 'vitest';
import User from '../../models/user.js';

const prisma = new PrismaClient();

beforeEach(async () => {
  this.data = {
    email: "fdescarte@gmail.com",
    password: "123456",
    name: "Fábio José da Silva",
    numusp: "5265565",
    phone: "(11) 98030-9205"
  }

  await prisma.$transaction([
    prisma.user.deleteMany()
  ]);
})

describe ('user', () => {
  it('should save', async () => {
    const user = new User();
    const newUser = await user.create(this.data);
    expect(newUser).toBeTruthy();
  }),

  it('should not save if email not present', async () => {
    const data = {
      email: "",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['email']['_errors']).toContain('Required Email');
  }),

  it('should not save if email is not valid', async () => {
    const data = {
      email: "dddd",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['email']['_errors']).toContain('Invalid email');
  }),

  it('should not save if email already exists', async () => {
    const user = new User();
    await user.create(this.data);

    await user.isValid(this.data);
    expect(user.error['email']).toMatch(/Email already in use/);
  }),

  it('should not save if password not present', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['password']['_errors']).toContain('Required Password');
  }),

  it('should not save if password length is less than 6', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['password']['_errors']).toContain('String must contain at least 6 character(s)');
  }),

  it('should not save if name not present', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['name']['_errors']).toContain('Required Name');
  }),

  it('should not save if numusp not present', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await user.isValid(data);
    expect(user.error['base']['numusp']['_errors']).toContain('Required NumUSP');
  }),

  it('should not save if numusp already exists', async () => {
    const user = new User();
    await user.create(this.data);

    await user.isValid(this.data);
    expect(user.error['numusp']).toMatch(/Numusp already in use/);
  }),

  it('should throw exception if data is invalid', async () => {
    const data = {
      email: "dddd",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    }

    const user = new User();
    await expect(() => user.create(data)).rejects.toThrowError('Invalid email');
  })
})
