import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const prisma = new PrismaClient(); // Initialize PrismaClient once

const updateReviewById = async (
  id,
  { userId, propertyId, rating, comment }
) => {
  if (!id) {
    return null;
  }
  if (!id) {
    throw new Error("Review ID is required.");
  }

  try {
    // If no matching review exists, throw a NotFoundError
    const reviewFound = await prisma.review.findUnique({
      where: { id },
    });
    if (!reviewFound) {
      throw new NotFoundError("Review", id);
    }

    // Validate user and property concurrently using Promise.all
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

    // Update the review and return it
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        user: userId
          ? {
              connect: { id: userId },
            }
          : undefined,
        property: propertyId
          ? {
              connect: { id: propertyId },
            }
          : undefined,
        rating: rating !== undefined ? rating : undefined,
        comment: comment !== undefined ? comment : undefined,
      },
    });

    return updatedReview;
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client disconnects
  }
};

export default updateReviewById;
