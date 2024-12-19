import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If no matching user exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deleteUserById = async (id) => {
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();
  const userFound = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userFound) {
    throw new NotFoundError("User", id);
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });
};

export default deleteUserById;
