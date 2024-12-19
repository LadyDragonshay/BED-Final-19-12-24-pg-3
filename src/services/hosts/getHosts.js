import { PrismaClient } from "@prisma/client";

const getHosts = async (name) => {
  const prisma = new PrismaClient();
  const hosts = await prisma.host.findMany({
    where: {
      name: {
        contains: name,
      },
    },
  });

  return hosts;
};

export default getHosts;
