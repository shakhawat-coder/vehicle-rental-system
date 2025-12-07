import express from "express";
const router = express.Router();
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth.middleware";
import { Roles } from "../auth/auth.constant";

router.post(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingController.createBooking
);
router.get(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingController.getAllBookings
);
router.put(
  "/:bookingId",
  auth(Roles.admin, Roles.customer),
  bookingController.updateBooking
);
export const bookingRoutes = router;
