import { PrismaClient } from "@prisma/client";

const getReviews = async (userId, propertyId) => {
  const prisma = new PrismaClient();
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      propertyId,
    },
  });

  return reviews;
};

export default getReviews;
