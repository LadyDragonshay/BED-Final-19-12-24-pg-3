import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const createProperty = async (
  title,
  description,
  location,
  pricePerNight,
  bedroomCount,
  bathRoomCount,
  maxGuestCount,
  hostId,
  rating
) => {
  const prisma = new PrismaClient();
  if (
    !title ||
    !description ||
    !location ||
    !pricePerNight ||
    !bedroomCount ||
    !bathRoomCount ||
    !maxGuestCount ||
    !hostId ||
    !rating
  ) {
    return null;
  }
  // If no matching host exists for the given hostId, throw a NotFoundError.
  const hostFound = await prisma.host.findUnique({
    where: {
      id: hostId,
    },
  });

  if (!hostFound) {
    throw new NotFoundError("host", hostId);
  }

  // Create the new property and return it.
  const newProperty = await prisma.property.create({
    data: {
      host: {
        connect: {
          id: hostId,
        },
      },
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
    },
  });

  return newProperty;
};

export default createProperty;
