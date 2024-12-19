import { PrismaClient } from "@prisma/client";

const getAmenities = async () => {
  // Create a new instance of PrismaClient to interact with the database
  const prisma = new PrismaClient();

  // Retrieve all amenities from the database using PrismaClient
  const amenities = await prisma.amenity.findMany();

  // Return the array of amenities fetched from the database
  return amenities;
};

export default getAmenities;
