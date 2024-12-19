import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

// If a matching property exists for the given id, return it.
// Otherwise, throw a NotFoundError.
const getReviewById = async (id) => {
  const prisma = new PrismaClient();
  const review = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (review) return review;

  throw new NotFoundError("review", id);
};

export default getReviewById;
