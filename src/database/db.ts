import { Pool } from "pg";
import config from "../config";

// =======db========
export const pool = new Pool({
  connectionString: `${config.connecionString}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6), 
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'customer'))
    )`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(50) CHECK (type IN ('car', 'bike', 'truck', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(30) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
    `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP NOT NULL,
        rent_end_date TIMESTAMP NOT NULL,
        total_price NUMERIC NOT NULL CHECK (total_price > 0),
        status VARCHAR(30) CHECK (status IN ('active', 'cancelled','returned'))
    )`);
};
export default initDB;
