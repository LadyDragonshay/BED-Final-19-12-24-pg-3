import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateUserById = async (
  id,
  { username, password, name, email, phoneNumber, profilePicture }
) => {
  console.log(id);
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();

  // If no matching user exists for the given id, throw a NotFoundError.
  const userFound = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!userFound) {
    throw new NotFoundError("user", id);
  }

  // Update the user and return it.
  const updatedUser = await prisma.user.update({
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
    },
  });

  return updatedUser;
};

export default updateUserById;
