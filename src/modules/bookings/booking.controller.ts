import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const loggedInUser = req.user as { id: string; role: string };

    const result = await bookingService.createBooking(
      data,
      loggedInUser.id,
      loggedInUser.role
    );
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user as { id: string; role: string };
    if (loggedInUser.role == "admin") {
      const result = await bookingService.getAllBookings();
      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
      });
    } else {
      const result = await bookingService.getBookingsByCustomerId(
        loggedInUser.id
      );
      res.status(200).json({
        success: true,
        message: "Your bookings retrieved successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal Server Error",
      success: false,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params as { bookingId: string };
    const { status } = req.body;

    const loggedInUser = req.user as { id: string; role: string };

    const result = await bookingService.updateBooking(
      bookingId,
      status,
      loggedInUser
    );

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Booking update failed",
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
