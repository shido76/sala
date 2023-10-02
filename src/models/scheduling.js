import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

function dateToISO(dateStr) {
  return new Date(dateStr);
}

class Scheduling extends Base {
  constructor() {
    super();
    this.error = {
      base: "",
      description: [],
      startAt: [],
      endAt: [],
    };
  }

  static async findAll(filter = {}) {
    return await prisma.scheduling.findMany({
      where: filter,
      select: {
        id: true,
        description: true,
        startAt: true,
        endAt: true,
        userId: true,
        locationId: true,
      },
      orderBy: {
        startAt: 'asc',
      }
    });
  }

  async isValid(data) {
    const schema = z.object({
      description: z.string().nonempty('Required Description'),
      startAt: z.date({
        required_error: "Required startAt",
        invalid_type_error: "Invalid startAt",
      }),
      endAt: z.date({
        required_error: "Required endAt",
        invalid_type_error: "Invalid endAt",
      }),
      userId: z.string().uuid().nonempty('Required UserId'),
      locationId: z.string().uuid().nonempty('Required LocationId'),
    });

    const result = schema.safeParse(data);
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    return this.error.description.length === 0 && 
           this.error.startAt.length === 0 &&
           this.error.endAt.length === 0
  }
  async create(data) {
    const { description, startAt, endAt, userId, locationId } = data;

    if (!await this.isValid({
      description,
      startAt: dateToISO(startAt),
      endAt: dateToISO(endAt),
      userId,
      locationId
    }))
      throw new CustomError(JSON.stringify(this.error), 209);


    const scheduling = await prisma.scheduling.create({
      data: {
        description,
        startAt: dateToISO(startAt),
        endAt: dateToISO(endAt),
        user: {
          connect: {
            id: userId
          }
        },
        location: {
          connect: {
            id: locationId
          }
        }
      }
    })

    return scheduling;
  }
}

export default Scheduling;