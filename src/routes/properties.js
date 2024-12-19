import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getProperties from "../services/properties/getProperties.js";
import createProperty from "../services/properties/createProperty.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Received request with query params:", req.query);

    const { hostId, location, pricePerNight, amenities } = req.query;

    // Log the extracted parameters
    console.log("Extracted parameters:", {
      hostId,
      location,
      pricePerNight,
      amenities,
    });

    // Add logging to see the URL being hit
    console.log("Request URL:", req.originalUrl);

    const properties = await getProperties(
      hostId,
      location,
      pricePerNight,
      amenities
    );

    // Log the length of results
    console.log(`Found ${properties.length} properties`);

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in route handler:", error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    if (!property) {
      res.status(404).json({
        message: `Property with id ${id} not found.`,
        property,
      });
    } else {
      res.status(200).json(property);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;
    const newProperty = await createProperty(
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating
    );

    if (!newProperty) {
      res.status(400).json({
        message: "Failed to create property. Please check your input data.",
        newProperty,
      });
    } else {
      res.status(201).json(newProperty);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "No id has been given!",
      });
    }

    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;

    const updatedProperty = await updatePropertyById(id, {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    });

    if (!updatedProperty) {
      return res.status(404).json({
        message: `Property with id ${id} not found`,
      });
    }

    // Return the successful update
    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error); // "Handle errors"
  }
});

router.delete("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deletePropertyById(id);

      res.status(200).send({
        message: `Property with id ${id} successfully deleted`,
      });
    } else {
      res.status(404).json({
        message: `Property with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
