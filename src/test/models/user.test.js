import { expect, describe, it, beforeEach, beforeAll } from 'vitest';
import bcryptjs from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import User from '../../models/user.js';

describe ('user', () => {
  beforeAll(async () => {
    return async () => {
      await prisma.$transaction([
        prisma.user.deleteMany({})
      ]);
    }
  }),

  beforeEach(async () => {
    this.data = {
      email: "fdescarte@gmail.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    };

    await prisma.$transaction([
      prisma.user.deleteMany({})
    ]);
    await prisma.$disconnect();
  });

  it('should save', async () => {
    const user = new User(this.data);
    const newUser = await user.create();
    expect(newUser).toBeTruthy();
  }),

  it('should not save if email not present', async () => {
    const data = {
      email: "",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['email']['_errors']).toContain('Required Email');
  }),

  it('should not save if email is not valid', async () => {
    const data = {
      email: "dddd",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['email']['_errors']).toContain('Invalid email');
  }),

  it('should not save if email already exists', async () => {
    const user = new User(this.data);
    await user.create();

    await user.isValid();
    expect(user.error['email']).toMatch(/Email already in use/);
  }),

  it('should not save if password not present', async () => {
    const data = {
      email: "fjs@test.com",
      password: "",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['password']['_errors']).toContain('Required Password');
  }),

  it('should not save if password length is less than 6', async () => {
    const data = {
      email: "fjs@test.com",
      password: "123",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['password']['_errors']).toContain('String must contain at least 6 character(s)');
  }),

  it('should not save if name not present', async () => {
    const data = {
      email: "fjs@test.com",
      password: "123456",
      name: "",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['name']['_errors']).toContain('Required Name');
  }),

  it('should not save if numusp not present', async () => {
    const data = {
      email: "fjs@test.com",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await user.isValid();
    expect(user.error['base']['numusp']['_errors']).toContain('Required NumUSP');
  }),

  it('should not save if numusp already exists', async () => {
    const user = new User(this.data);
    await user.create();

    await user.isValid();
    expect(user.error['numusp']).toMatch(/Numusp already in use/);
  }),

  it('should throw exception if data is invalid', async () => {
    const data = {
      email: "dddd",
      password: "123456",
      name: "Fábio José da Silva",
      numusp: "5265565",
      phone: "(11) 91234-5678"
    }

    const user = new User(data);
    await expect(() => user.create()).rejects.toThrowError('Invalid email');
  }),

  it('should retrieve all users', async () => {
    let users = await User.findAll();
    expect(users.length).toEqual(0);

    const user = new User(this.data);
    await user.create();

    users = await User.findAll();
    expect(users.length).toEqual(1);
  }),

  it('should delete a user', async () => {
    const user = await new User(this.data).create();
    await User.destroy(user.id);
    
    const users = await User.findAll();
    expect(users.length).toEqual(0);
  }),

  it('should retrieve a user', async () => {
    const user = await new User(this.data).create();
    const userRetrieved = await User.find(user.id);
    expect(userRetrieved.id).toEqual(user.id);
  }),

  it('should update a user', async () => {
    const data = {
      name: "Flávio Camargo",
      password: "567890",
    };
    const user = await new User(this.data).create();
    const userRetrieved = await new User(data).update(user.id);
    expect(userRetrieved.name).toEqual("Flávio Camargo");
    expect(await bcryptjs.compare("567890", userRetrieved.passwordHash)).toBe(true);
  }),

  it('should not update if name not present', async () => {
    const user = await new User(this.data).create();
    await expect(() => new User({ name: "" }).update(user.id)).rejects.toThrowError('Required Name');
  })
})
