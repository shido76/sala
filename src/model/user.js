import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function emailIsInUse(email) {
  return await prisma.user.findUnique({
    where: {
      email
    }
  })
}

class User {
  async create({ email, password, name, numusp, phone }) {

    if (await emailIsInUse(email)) {
      throw new Error('Email already in use');
    } 
    
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