import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If no matching host exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deleteHostById = async (id) => {
  console.log("delete host id:", id);
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();
  const hostFound = await prisma.host.findUnique({
    where: {
      id,
    },
  });

  if (!hostFound) {
    throw new NotFoundError("host", id);
  }

  const deletedHost = await prisma.host.delete({
    where: {
      id,
    },
  });
  return deletedHost;
};

export default deleteHostById;
