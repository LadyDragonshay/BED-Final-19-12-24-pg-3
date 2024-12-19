import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const createReview = async (userId, propertyId, rating, comment) => {
  if (!userId || !propertyId || !rating || !comment) {
    return null;
  }
  const prisma = new PrismaClient();

  // If no matching user exists for the given userId, throw a NotFoundError.
  const userFound = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userFound) {
    throw new NotFoundError("user", userId);
  }

  // If no matching property exists for the given propertyId, throw a NotFoundError.
  const propertyFound = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!propertyFound) {
    throw new NotFoundError("property", propertyId);
  }

  // Create the new review and return it.
  const newReview = await prisma.review.create({
    data: {
      userId,
      propertyId,
      rating,
      comment,
    },
  });

  return newReview;
};

export default createReview;
