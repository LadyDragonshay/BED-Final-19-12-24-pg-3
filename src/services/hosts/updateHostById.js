import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateHostById = async (
  id,
  { username, password, name, email, phoneNumber, profilePicture, aboutMe }
) => {
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();

  // If no matching host exists for the given id, throw a NotFoundError.
  const hostFound = await prisma.host.findUnique({
    where: {
      id,
    },
  });

  if (!hostFound) {
    throw new NotFoundError("host", id);
  }

  // Update the host and return it.
  const updatedHost = await prisma.host.update({
    where: {
      id,
    },
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    },
  });

  return updatedHost;
};

export default updateHostById;
