import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getBookings from "../services/bookings/getBookings.js";
import createBooking from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";
import updateBookingById from "../services/bookings/updateBookingById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching bookings...");
    const { userId, propertyId } = req.query;
    const bookings = await getBookings(userId, propertyId);
    console.log("Bookings fetched", bookings);

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      console.log(`Booking with id ${id} was not found.`);
      res.status(404).json({ error: "booking was not found" });
    } else {
      res.status(200).json(booking);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;
    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );

    if (!newBooking) {
      res.status(400).json(newBooking);
    } else {
      res.status(201).json({
        message: `Booking successfully created`,
        booking: newBooking,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      } = req.body;
      const updatedBooking = await updateBookingById(id, {
        userId,
        propertyId,
        checkinDate,
        checkoutDate,
        numberOfGuests,
        totalPrice,
        bookingStatus,
      });

      res.status(200).json(updatedBooking);
    } else {
      res.status(400).json({
        message: "No id has been given!",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteBookingById(id);

      res.status(200).json({
        message: "Booking with id ${id} was successfully deleted!",
      });
    } else {
      res.status(404).json({
        message: "Booking with id ${id} was not found !",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
