import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

class Location extends Base {
  constructor() {
    super();
    this.error = {
      base: "",
      name: [],
      capacity: [],
    };
  }

  static async findBy(attr, value) {
    return await prisma.location.findUnique({
      where: {
        [attr]: value
      }
    })
  }

  static async findAll(filter = {}) {

    return await prisma.location.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        capacity: true,
      },
      orderBy: {
        name: 'asc',
      }
    });
  }

  async isValid(data) {
    const schema = z.object({
      name: z.string().nonempty('Required Name'),
      capacity: z.number({
        invalid_type_error: 'Capacity must be a number',
      }).int().positive('Capacity must be greater than 0')
    });

    const result = schema.safeParse(data);
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    const { name } = result.data;

    if (await Location.findBy('name', name))
      this.error['name'].push('Name already in use');

    return this.error.name.length === 0 && 
           this.error.capacity.length === 0
  }
  async create(data) {
    if (!await this.isValid(data))
      throw new CustomError(JSON.stringify(this.error), 209);

    const { name, capacity } = data;

    const location = await prisma.location.create({
      data: {
        name,
        capacity,
      }
    })

    return location;
  }
}

export default Location;