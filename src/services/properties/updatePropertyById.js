import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updatePropertyById = async (
  id,
  {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    hostId,
    rating,
  }
) => {
  console.log("Received ID:", id);
  if (!id) {
    console.log("ID is falsy");
    return null;
  }

  const prisma = new PrismaClient();

  try {
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        hostId,
        rating,
      },
    });

    return updatedProperty;
  } catch (error) {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export default updatePropertyById;
