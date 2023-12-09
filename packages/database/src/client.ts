import * as PrismaTypes from '@prisma/client';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();
export { PrismaTypes };

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
