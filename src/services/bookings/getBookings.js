import { PrismaClient } from "@prisma/client";

const getBookings = async (userId, propertyId) => {
  const prisma = new PrismaClient();
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      propertyId,
    },
  });

  return bookings;
};

export default getBookings;
