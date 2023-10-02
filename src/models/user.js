import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

class User extends Base {
  constructor() {
    super();
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
    return await prisma.user.findUnique({
      where: {
        [attr]: value
      }
    })
  }

  static async findAll(filter = { active: true }) {

    return await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        email: true,
        numusp: true,
        phone: true,
        profiles: true,
        active: true,
      },
      orderBy: {
        name: 'asc',
      }
    });
  }

  async isValid(data) {
    const schema = z.object({
      email: z.string().email().nonempty('Required Email'),
      password: z.string().min(6).nonempty('Required Password'),
      name: z.string().nonempty('Required Name'),
      numusp: z.string().nonempty('Required NumUSP'),
      phone: z.string(),
    });

    const result = schema.safeParse(data);
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
  async create(data) {
    if (!await this.isValid(data))
      throw new CustomError(JSON.stringify(this.error), 209);

    const { email, password, name, numusp, phone, active } = data;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 8),
        name,
        numusp,
        phone,
        active,
      }
    })

    return user;
  }
}

export default User;