import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If no matching review exists for the given id, throw a NotFoundError.
// If it does, delete it.
const deleteReviewById = async (id) => {
  const prisma = new PrismaClient();
  const reviewFound = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!reviewFound) {
    throw new NotFoundError("Review", id);
  }

  await prisma.review.delete({
    where: {
      id,
    },
  });
};

export default deleteReviewById;
