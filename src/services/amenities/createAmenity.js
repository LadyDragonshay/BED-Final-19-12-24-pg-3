import { PrismaClient } from "@prisma/client";

const createAmenity = async (name) => {
  if (!name) {
    return null;
  }
  const prisma = new PrismaClient();
  const newAmenity = await prisma.amenity.create({
    data: { name },
  });

  return newAmenity;
};

export default createAmenity;
