import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If no matching amenity exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deleteAmenityById = async (id) => {
  const prisma = new PrismaClient();
  const amenityFound = await prisma.amenity.findUnique({
    where: {
      id,
    },
  });

  if (!amenityFound) {
    throw new NotFoundError("amenity", id);
  }

  await prisma.amenity.delete({
    where: {
      id,
    },
  });
};

export default deleteAmenityById;
