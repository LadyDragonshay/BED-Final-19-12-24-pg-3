import { PrismaClient } from "@prisma/client";

const getProperties = async (hostId, location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();

  console.log("Building query with parameters:", {
    hostId,
    location,
    pricePerNight,
    amenities,
  });

  try {
    const properties = await prisma.property.findMany({
      where: {
        ...(hostId && { hostId }), // Filter op hostId als meegegeven
        ...(location && { location: { contains: location } }), // Filter op location
        ...(pricePerNight && {
          pricePerNight: parseFloat(pricePerNight), // Filter op prijs
        }),
        ...(amenities && {
          amenities: {
            some: {
              name: { contains: amenities }, // Filter op amenities
            },
          },
        }),
      },
      include: {
        amenities: true, // Inclusief amenities relatie
        host: true, // Inclusief host relatie
      },
    });

    console.log("Retrieved properties:", properties);
    return properties;
  } catch (error) {
    console.error("Prisma query error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default getProperties;
