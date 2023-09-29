import { PrismaClient } from '@prisma/client';
import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import UserAuthDB from '../../models/userAuthDB.js';
import User from '../../models/user.js';

const prisma = new PrismaClient();

describe('user auth db', () => {
  beforeAll(async () => {
    this.data = {
      email: "fdescartes@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 98030-9205"
    };

    const user = new User();
    await user.create(this.data);
  }),

  it('should return user if email and password are correct and active', async () => {
    const findedUser = await UserAuthDB.authenticate(this.data['email'], this.data['password']);
    expect(findedUser).toBeTruthy();
  }),

  it('should not return user if email is incorrect', async () => {
    const findedUser = await UserAuthDB.authenticate('teste@teste.com', this.data['password']);
    expect(findedUser).toBeFalsy();
  }),

  it('should not return user if password is incorrect', async () => {
    const findedUser = await UserAuthDB.authenticate(this.data['email'], '1234567');
    expect(findedUser).toBeFalsy();
  }),

  it('should not return user if is inactive', async () => {
    const data = {
      email: "fjs@usp.br",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "52655651",
      phone: "(11) 98030-9205",
      active: false
    };

    const user = new User();
    await user.create(data);
    const findedUser = await UserAuthDB.authenticate(data['email'], data['password']);
    expect(findedUser).toBeFalsy();
  })
})