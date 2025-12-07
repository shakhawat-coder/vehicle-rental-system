import { pool } from "../../database/db";

const createBooking = async (
  payload: Record<string, unknown>,
  loggedInUser?: string,
  loggedInUserRole?: string
) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error(
      "Missing required fields: customer_id, vehicle_id, rent_start_date, rent_end_date"
    );
  }

  if (
    loggedInUser &&
    loggedInUser !== customer_id &&
    loggedInUserRole !== "admin"
  ) {
    throw new Error("You are not allowed to book other's vehicle");
  }
  const vehicleInfo = await pool.query(
    "SELECT daily_rent_price, availability_status, vehicle_name FROM vehicles WHERE id = $1",
    [vehicle_id]
  );
  if (vehicleInfo.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  if (vehicleInfo.rows[0].availability_status === "booked") {
    const err: any = new Error("Vehicle is already booked");
    err.statusCode = 400;
    throw err;
  }

  const dailyPrice = vehicleInfo.rows[0].daily_rent_price;
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);

  const differentTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(differentTime / (1000 * 3600 * 24));

  if (totalDays <= 0) {
    throw new Error("Invalid date range: end date must be after start date");
  }

  const totalPrice = dailyPrice * totalDays;

  const result = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
    [vehicle_id]
  );
  const data = result.rows[0];
  const responsedata = {
    ...data,
    vehicle: {
      vehicle_name: vehicleInfo.rows[0].vehicle_name,
      daily_rent_price: vehicleInfo.rows[0].daily_rent_price,
    },
  };
  return responsedata;
};
const getAllBookings = async () => {
  const bookingsResult = await pool.query(
    "SELECT * FROM bookings ORDER BY id DESC"
  );

  const bookingsWithVehicles = await Promise.all(
    bookingsResult.rows.map(async (booking) => {
      const vehicleInfo = await pool.query(
        "SELECT vehicle_name, registration_number, type, daily_rent_price FROM vehicles WHERE id = $1",
        [booking.vehicle_id]
      );

      const customerInfo = await pool.query(
        "SELECT name, email, FROM users WHERE id = $1",
        [booking.customer_id]
      );
      const responsedata = {
        ...booking,
        customer: {
          name: customerInfo.rows[0]?.name,
          email: customerInfo.rows[0]?.email,
        },
        vehicle: {
          vehicle_name: vehicleInfo.rows[0]?.vehicle_name,
          registration_number: vehicleInfo.rows[0]?.registration_number,
        },
      };

      return responsedata;
    })
  );

  return bookingsWithVehicles;
};
const getBookingsByCustomerId = async (customerId: string) => {
  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC",
    [customerId]
  );
  const bookingsWithVehicles = await Promise.all(
    result.rows.map(async (booking) => {
      const vehicleInfo = await pool.query(
        "SELECT vehicle_name, registration_number, type, daily_rent_price FROM vehicles WHERE id = $1",
        [booking.vehicle_id]
      );
      const responsedata = {
        ...booking,
        vehicle: {
          vehicle_name: vehicleInfo.rows[0]?.vehicle_name,
          registration_number: vehicleInfo.rows[0]?.registration_number,
          type: vehicleInfo.rows[0]?.type,
        },
      };

      return responsedata;
    })
  );

  return bookingsWithVehicles;
};

const updateBooking = async (
  bookingId: string,
  status: "cancelled" | "returned",
  loggedInUser: { id: string; role: string }
) => {
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingResult.rows[0];

  if (loggedInUser.role === "customer") {
    if (booking.customer_id !== Number(loggedInUser.id)) {
      throw new Error("You can only update your own bookings");
    }

    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("You can only cancel before the start date");
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled' 
       WHERE id = $1 
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return result.rows[0];
  }

  if (loggedInUser.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark as returned");
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'returned' 
       WHERE id = $1 
       RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
    const data = result.rows[0];
    const responseData = {
      ...data,
      vehicle: {
        availability_status: "available",
      },
    };

    return responseData;
  }

  throw new Error("Unauthorized role");
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBookingsByCustomerId,
  updateBooking,
};
