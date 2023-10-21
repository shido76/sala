import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import Base from '../models/base.js';
import CustomError from '../lib/customError.js';

function dateToISO(dateStr) {
  return new Date(dateStr);
}

function prepareDataCreate(data) {
  return { 
      ...data,
      startAt: data.startAt ? dateToISO(data.startAt) : null,
        endAt: data.endAt ? dateToISO(data.endAt) : null
  };
}

function prepareDataUpdate(data) {
  const dataModified = { ...data };

  if (data.startAt)
    dataModified['startAt'] = dateToISO(data.startAt);
  if (data.endAt)
    dataModified['endAt'] = dateToISO(data.endAt);

  return dataModified;
}
class Scheduling extends Base {
  constructor(data) {
    super();
    this.data = data;
    this.error = {
      base: "",
      description: [],
      startAt: [],
      endAt: [],
    };
  }

  static async findAll({
    select = {
      id: true,
      description: true,
      startAt: true,
      endAt: true,
      userId: true,
      locationId: true,
    },
    where = {},
    orderBy = { startAt: 'desc' }
  } = {}) {
    return await super.findAll(prisma.scheduling, select, where, orderBy)
  }

  async isValid() {
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

    const result = schema.safeParse(prepareDataCreate(this.data));
    
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    return this.error.description.length === 0 && 
           this.error.startAt.length === 0 &&
           this.error.endAt.length === 0
  }

  async isValidUpdate() {
    const schema = z.object({
      description: z.string().nonempty('Required Description').optional(),
      startAt: z.date({
        required_error: "Required startAt",
        invalid_type_error: "Invalid startAt",
      }).optional(),
      endAt: z.date({
        required_error: "Required endAt",
        invalid_type_error: "Invalid endAt",
      }).optional(),
      userId: z.string().uuid().nonempty('Required UserId').optional(),
      locationId: z.string().uuid().nonempty('Required LocationId').optional(),
    });

    const result = schema.safeParse(prepareDataUpdate(this.data));
    if (!result.success) {
      this.error.base = result.error.format();
      return false;
    }

    return this.error.description.length === 0 &&
      this.error.startAt.length === 0 &&
      this.error.endAt.length === 0
  }
  async create() {
    if (!await this.isValid())
      throw new CustomError(JSON.stringify(this.error), 209);

    const { description, startAt, endAt, userId, locationId } = prepareDataCreate(this.data);

    const scheduling = await prisma.scheduling.create({
      data: {
        description,
        startAt,
        endAt,
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

  async update(id) {
    if (!await this.isValidUpdate())
      throw new CustomError(JSON.stringify(this.error), 209);

    const scheduling = await prisma.scheduling.update({
      where: {
        id
      },
      data: prepareDataUpdate(this.data),
    })

    return scheduling;
  }

  static async destroy(id) {
    return await super.destroy(prisma.scheduling, id);
  }

  static async find(id) {
    return await super.find(prisma.scheduling, id);
  }
}

export default Scheduling;