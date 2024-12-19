import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getReviews from "../services/reviews/getReviews.js";
import createReview from "../services/reviews/createReview.js";
import getReviewById from "../services/reviews/getReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";
import updateReviewById from "../services/reviews/updateReviewById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching review...");
    const { userId, propertyId } = req.query;
    const reviews = await getReviews(userId, propertyId);
    console.log("Reviews fetched", reviews);

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      res.status(404).json(review);
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;
    const newReview = await createReview(userId, propertyId, rating, comment);

    if (!newReview) {
      res.status(400).json(newReview);
    } else {
      res.status(201).json(newReview);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const { userId, propertyId, rating, comment } = req.body;
      const updatedReview = await updateReviewById(id, {
        userId,
        propertyId,
        rating,
        comment,
      });

      if (!updatedReview) {
        res.status(404).json(updatedReview);
      } else {
        res.status(200).json(updatedReview);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteReviewById(id);

      res.status(200).json({
        message: `Review with id ${id} was successfully deleted!`,
      });
    } else {
      res.status(404).json({
        message: `Review with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
