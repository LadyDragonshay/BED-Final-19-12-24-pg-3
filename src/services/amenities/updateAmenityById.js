import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateAmenityById = async (id, { name }) => {
  if (!id) {
    return null;
  }
  const prisma = new PrismaClient();

  // If no matching amenity exists for the given id, throw a NotFoundError.
  const amenityFound = await prisma.amenity.findUnique({
    where: {
      id,
    },
  });

  if (!amenityFound) {
    throw new NotFoundError("amenity", id);
  }

  // Update the amenity and return it.
  const updatedAmenity = await prisma.amenity.update({
    where: {
      id,
    },
    data: { name },
  });

  return updatedAmenity;
};

export default updateAmenityById;
