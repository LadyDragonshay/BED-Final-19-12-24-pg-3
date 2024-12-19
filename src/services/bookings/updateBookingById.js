import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const prisma = new PrismaClient(); // Shared PrismaClient instance

const updateBookingById = async (
  id,
  {
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
  }
) => {
  // if (
  //   !userId ||
  //   !propertyId ||
  //   !checkinDate ||
  //   !checkoutDate ||
  //   !numberOfGuests ||
  //   !totalPrice ||
  //   !bookingStatus
  // ) {
  //   return null;
  // }
  if (!id) {
    throw new Error("Booking ID is required.");
    return null;
  }

  try {
    // Step 1: Check if the booking exists
    const bookingFound = await prisma.booking.findUnique({ where: { id } });
    if (!bookingFound) {
      throw new NotFoundError("booking", id);
    }

    // Step 2: Validate user and property concurrently (if provided)
    const validations = [];

    if (userId) {
      validations.push(
        prisma.user.findUnique({ where: { id: userId } }).then((userFound) => {
          if (!userFound) throw new NotFoundError("user", userId);
        })
      );
    }

    if (propertyId) {
      validations.push(
        prisma.property
          .findUnique({ where: { id: propertyId } })
          .then((propertyFound) => {
            if (!propertyFound) throw new NotFoundError("property", propertyId);
          })
      );
    }

    // Wait for all validations to complete
    await Promise.all(validations);

    // Step 3: Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate: checkinDate || bookingFound.checkinDate,
        checkoutDate: checkoutDate || bookingFound.checkoutDate,
        numberOfGuests:
          numberOfGuests !== undefined
            ? numberOfGuests
            : bookingFound.numberOfGuests,
        totalPrice:
          totalPrice !== undefined ? totalPrice : bookingFound.totalPrice,
        bookingStatus: bookingStatus || bookingFound.bookingStatus,
        user: userId ? { connect: { id: userId } } : undefined,
        property: propertyId ? { connect: { id: propertyId } } : undefined,
      },
    });

    return updatedBooking;
  } finally {
    await prisma.$disconnect(); // Ensure PrismaClient disconnects
  }
};

export default updateBookingById;
