import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If a matching host exists for the given id, return it.
// Otherwise, throw a NotFoundError.
const getHostById = async (id) => {
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();
  const host = await prisma.host.findUnique({
    where: {
      id,
    },
  });

  if (host) return host;

  throw new NotFoundError("host", id);
};

export default getHostById;
