import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient();
};

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
