import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const login = async (username, password) => {
  const secretKey = process.env.AUTH_SECRET_KEY || "my-secret-key";
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      username,
      password,
    },
  });

  // If no user exists with the given username and password, return null.
  if (!user) {
    return null;
  }

  // Login was successful, return a token.
  const token = jwt.sign({ userId: user.id }, secretKey);

  return token;
};

export default login;
