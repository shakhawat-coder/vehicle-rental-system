import { pool } from "../../database/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
              VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles");
  return result;
};
const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);
  return result;
};
const updateVehicle = async (
  vehicleId: string,
  vehicle_name?: string,
  type?: string,
  registration_number?: string,
  daily_rent_price?: number,
  availability_status?: string
) => {
  const updates: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (vehicle_name !== undefined) {
    updates.push(`vehicle_name = $${index++}`);
    values.push(vehicle_name);
  }
  if (type !== undefined) {
    updates.push(`type = $${index++}`);
    values.push(type);
  }
  if (registration_number !== undefined) {
    updates.push(`registration_number = $${index++}`);
    values.push(registration_number);
  }
  if (daily_rent_price !== undefined) {
    updates.push(`daily_rent_price = $${index++}`);
    values.push(daily_rent_price);
  }
  if (availability_status !== undefined) {
    updates.push(`availability_status = $${index++}`);
    values.push(availability_status);
  }
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(vehicleId);
  const result = await pool.query(
    `UPDATE vehicles SET ${updates.join(
      ", "
    )} WHERE id = $${index} RETURNING *`,
    values
  );
  return result;
};
const deleteVehicle = async (vehicleId: string) => {
  const vehiicleCheck = await pool.query(
    "SELECT id FROM vehicles WHERE id = $1",
    [vehicleId]
  );
  if (vehiicleCheck.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  const activeBookingsCheck = await pool.query(
    `SELECT COUNT(*) as active_count FROM bookings 
     WHERE vehicle_id = $1 AND status = 'active'`,
    [vehicleId]
  );
  const activeCount = parseInt(activeBookingsCheck.rows[0].active_count);
  if (activeCount > 0) {
    throw new Error(
      `Vehicle has ${activeCount} active booking(s). Cancel them before deleting.`
    );
  }
  const vehicleBookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1`,
    [vehicleId]
  );
  const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);
  return result;
};
export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
