import { PrismaClient } from "@prisma/client";

const createHost = async (
  username,
  password,
  name,
  email,
  phoneNumber,
  profilePicture,
  aboutMe
) => {
  if (
    !username ||
    !password ||
    !name ||
    !email ||
    !phoneNumber ||
    !profilePicture ||
    !aboutMe
  ) {
    return null;
  }
  const prisma = new PrismaClient();
  const newHost = await prisma.host.create({
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

  return newHost;
};

export default createHost;
