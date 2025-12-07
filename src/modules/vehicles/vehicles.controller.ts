import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal Server Error",
      success: false,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No vehicles found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal Server Error",
      success: false,
    });
  }
};
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;

    const result = await vehicleService.getSingleVehicle(vehicleId as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal Server Error",
      success: false,
    });
  }
};
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;
    const data = req.body;

    const result = await vehicleService.updateVehicle(
      vehicleId as string,
      data.vehicle_name,
      data.type,
      data.registration_number,
      data.daily_rent_price,
      data.availability_status
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Internal Server Error",
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId;
    const result = await vehicleService.deleteVehicle(vehicleId as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error: any) {
    if (error.message && error.message.includes("active booking")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      error: error.message || error,
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
