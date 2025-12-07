import express, { Request, Response } from "express";
import initDB from "./database/db";
import config from "./config";
import { userRoutes } from "./modules/users/users.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();
const port = config.port;
app.use(express.json());
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental Management System");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// ===========not found route ============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
});
app.listen(port, () => {
  console.log(` App is listening on port ${port}`);
});
