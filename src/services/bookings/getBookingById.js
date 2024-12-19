import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If a matching booking exists for the given id, return it.
// Otherwise, throw a NotFoundError.
const getBookingById = async (id) => {
  const prisma = new PrismaClient();
  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
  });

  if (booking) return booking;

  throw new NotFoundError("booking", id);
};

export default getBookingById;
