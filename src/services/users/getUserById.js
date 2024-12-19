import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If a matching user exists for the given id, return it.
// Otherwise, throw a NotFoundError.
const getUserById = async (id) => {
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user) return user;

  throw new NotFoundError("user", id);
};

export default getUserById;
