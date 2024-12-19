import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If a matching property exists for the given id, return it.
// Otherwise, throw a NotFoundError.
const getPropertyById = async (id) => {
  const prisma = new PrismaClient();
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (property) return property;

  throw new NotFoundError("property", id);
};

export default getPropertyById;
