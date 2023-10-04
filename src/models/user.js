import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

async function prepareDataCreate(data) {
  return {
    ...data,
    passwordHash: data.password ? await bcrypt.hash(data.password, 8) : null,
  };
}

async function prepareDataUpdate(data) {
  const dataModified = { ...data };

  if (data.password) {
    dataModified['passwordHash'] = await bcrypt.hash(data.password, 8);
    delete dataModified.password;
  }

  return dataModified;
}

class User extends Base {
  constructor(data) {
    super();
    this.data = data;
    this.error = {
      base: "",
      email: [],
      password: [],
      name: [],
      numusp: [],
      phone: []
    };
  }

  static async findBy(attr, value) {
    return await Base.findBy(prisma.user, attr, value);
  }

  static async findAll(
    select = {
      id: true,
      name: true,
      email: true,
      numusp: true,
      phone: true,
      profiles: true,
      active: true,
    }, 
    where = { active: true },
    orderBy = { name: 'asc' }
  ){
    return await Base.findAll(prisma.user, select, where, orderBy)
  }

  async isValid() {
    const schema = z.object({
      email: z.string().email().nonempty('Required Email'),
      password: z.string().min(6).nonempty('Required Password'),
      name: z.string().nonempty('Required Name'),
      numusp: z.string().nonempty('Required NumUSP'),
      phone: z.string(),
    });

    const result = schema.safeParse(await prepareDataCreate(this.data));

    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    } 

    const { email, numusp } = result.data;

    if (await User.findBy('email', email))
      this.error['email'].push('Email already in use');

    if (await User.findBy('numusp', numusp))
      this.error['numusp'].push('Numusp already in use');

    return this.error.email.length === 0 && 
           this.error.password.length === 0 && 
           this.error.name.length === 0 && 
           this.error.numusp.length === 0 && 
           this.error.phone.length === 0
  }
  async isValidUpdate() {
    const schema = z.object({
      email: z.string().email().nonempty('Required Email').optional(),
      password: z.string().min(6).nonempty('Required Password').optional(),
      name: z.string().nonempty('Required Name').optional(),
      numusp: z.string().nonempty('Required NumUSP').optional(),
      phone: z.string().optional(),
    });

    const result = schema.safeParse(await prepareDataUpdate(this.data));

    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    return this.error.email.length === 0 &&
      this.error.password.length === 0 &&
      this.error.name.length === 0 &&
      this.error.numusp.length === 0 &&
      this.error.phone.length === 0
  }
  async create() {
    if (!await this.isValid())
      throw new CustomError(JSON.stringify(this.error), 209);

    const { email, passwordHash, name, numusp, phone, active } = await prepareDataCreate(this.data);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        numusp,
        phone,
        active,
      }
    })

    return user;
  }

  async update(id) {
    if (!await this.isValidUpdate())
      throw new CustomError(JSON.stringify(this.error), 209);

    const user = await prisma.user.update({
      where: {
        id
      },
      data: await prepareDataUpdate(this.data),
    })

    return user;
  }

  static async destroy(id) {
    return await Base.destroy(prisma.user, id);
  }

  static async find(id) {
    return await Base.find(prisma.user, id);
  }
}

export default User;