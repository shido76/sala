import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import CustomError from '../lib/customError.js';

async function isNotUnique(attr, value) {
  return await prisma.user.findUnique({
    where: {
      [attr]: value
    }
  })
}

class User {
  constructor() {
    this.error = {
      base: "",
      email: [],
      password: [],
      name: [],
      numusp: [],
      phone: []
    };
  }

  async isValid(data) {
    const schema = z.object({
      email: z.string().email().nonempty('E-mail requerido'),
      password: z.string().min(6).nonempty('Password requerido'),
      name: z.string().nonempty('Nome requerido'),
      numusp: z.string().nonempty('Numero USP requerido'),
      phone: z.string(),
    });

    const result = schema.safeParse(data);
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    } 

    const { email, numusp } = result.data;

    if (await isNotUnique('email', email))
      this.error['email'].push('Email already in use');

    if (await isNotUnique('numusp', numusp))
      this.error['numusp'].push('Numusp already in use');

    return this.error.email.length === 0 && 
           this.error.password.length === 0 && 
           this.error.name.length === 0 && 
           this.error.numusp.length === 0 && 
           this.error.phone.length === 0
  }
  async create(data) {
    if (!await this.isValid(data))
      throw new CustomError(`Error to validate user: ${JSON.stringify(this.error)}`, 209);

    const { email, password, name, numusp, phone } = data;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 8),
        name,
        numusp,
        phone,
      }
    })

    return user;
  }
}

export default User;