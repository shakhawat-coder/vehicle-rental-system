import { pool } from "../../database/db";

const getAllUser = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );
  return result;
};

const updateUser = async (
  userId: string,
  name?: string,
  email?: string,
  role?: string,
  phone?: string
) => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (email !== undefined) {
    updates.push(`email = $${paramCount++}`);
    values.push(email);
  }
  if (role !== undefined) {
    updates.push(`role = $${paramCount++}`);
    values.push(role);
  }
  if (phone !== undefined) {
    updates.push(`phone = $${paramCount++}`);
    values.push(phone);
  }
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(userId);
  const query = `UPDATE users SET ${updates.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;
  const result = await pool.query(query, values);
  return result;
};

const deleteUser = async (userId: string) => {
  const userCheck = await pool.query(
    "SELECT id, name FROM users WHERE id = $1",
    [userId]
  );

  if (userCheck.rows.length === 0) {
    throw new Error("User not found");
  }

  const userName = userCheck.rows[0].name;

  // Check if the user has any active bookings
  const activeBookingsCheck = await pool.query(
    `SELECT COUNT(*) as active_count FROM bookings 
     WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  const activeCount = parseInt(activeBookingsCheck.rows[0].active_count);

  if (activeCount > 0) {
    throw new Error(
      `User "${userName}" has ${activeCount} active booking(s). Cancel them before deletion.`
    );
  }

  const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

  return result;
};
export const userService = { getAllUser, updateUser, deleteUser };
