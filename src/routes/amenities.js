import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getAmenities from "../services/amenities/getAmenities.js";
import createAmenity from "../services/amenities/createAmenity.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import deleteAmenityById from "../services/amenities/deleteAmenityById.js";
import updateAmenityById from "../services/amenities/updateAmenityById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching amanities...");
    const amenities = await getAmenities();
    console.log("Amenities fetched", amenities);

    res.status(200).json(amenities);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const amenity = await getAmenityById(id);

    if (!amenity) {
      res.status(404).json(amenity);
    } else {
      res.status(200).json(amenity);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newAmenity = await createAmenity(name);

    if (!newAmenity) {
      res.status(400).json(newAmenity);
    } else {
      res.status(201).json(newAmenity);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const { name } = req.body;
      const updatedAmenity = await updateAmenityById(id, {
        name,
      });

      if (!updatedAmenity) {
        res.status(404).json(updatedAmenity);
      } else {
        res.status(200).json(updatedAmenity);
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
      await deleteAmenityById(id);

      res.status(200).json({
        message: `Amenity with id ${id} was successfully deleted!`,
      });
    } else {
      res.status(404).json({
        message: "Amenity with id ${id} not found!",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
