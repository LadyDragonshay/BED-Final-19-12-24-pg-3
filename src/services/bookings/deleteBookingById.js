import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If no matching booking exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deleteBookingById = async (id) => {
  const prisma = new PrismaClient();
  const bookingFound = await prisma.booking.findUnique({
    where: {
      id,
    },
  });

  if (!bookingFound) {
    throw new NotFoundError("booking", id);
  }

  await prisma.booking.delete({
    where: {
      id,
    },
  });
};

export default deleteBookingById;
