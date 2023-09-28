import { PrismaClient } from '@prisma/client';

const env = {
  'development': ['query', 'info', 'warn', 'error'],
  'production': ['warn', 'error'],
  'test': ['error']
}

export const prisma = new PrismaClient({
  log: env[process.env.NODE_ENV],
});
