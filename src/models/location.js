import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

class Location extends Base {
  constructor(data) {
    super();
    this.data = data;
    this.error = {
      base: "",
      name: [],
      capacity: [],
    };
  }
  
  static async findBy(attr, value) {
    return await Base.findBy(prisma.location, attr, value);
  }
  
  static async findAll({
    select = {
      id: true,
      name: true,
      capacity: true,
    },
    where = {},
    orderBy = { name: 'asc' }
  } = {}) {
    return await Base.findAll(prisma.location, select, where, orderBy)
  }

  async isValid() {
    const schema = z.object({
      name: z.string().nonempty('Required Name'),
      capacity: z.number({
        invalid_type_error: 'Capacity must be a number',
      }).int().positive('Capacity must be greater than 0')
    });

    const result = schema.safeParse(this.data);
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

  async isValidUpdate() {
    const schema = z.object({
      name: z.string().nonempty('Required Name').optional(),
      capacity: z.number({
        invalid_type_error: 'Capacity must be a number',
      }).int().positive('Capacity must be greater than 0').optional()
    });

    const result = schema.safeParse(this.data);
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    return this.error.name.length === 0 &&
      this.error.capacity.length === 0
  }
  async create() {
    if (!await this.isValid())
      throw new CustomError(JSON.stringify(this.error), 209);

    const { name, capacity } = this.data;

    const location = await prisma.location.create({
      data: {
        name,
        capacity,
      }
    })

    return location;
  }

  async update(id) {
    if (!await this.isValidUpdate())
      throw new CustomError(JSON.stringify(this.error), 209);
    
    const location = await prisma.location.update({
      where: {
        id
      },
      data: this.data
    })

    return location;
  }

  static async destroy(id) {
    return await Base.destroy(prisma.location, id);
  }

  static async find(id) {
    return await Base.find(prisma.location, id);
  }
}

export default Location;