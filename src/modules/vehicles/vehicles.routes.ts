import express from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth.middleware";
import { Roles } from "../auth/auth.constant";

const router = express.Router();
router.post("/", auth(Roles.admin), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getSingleVehicle);
router.put("/:vehicleId", auth(Roles.admin), vehicleController.updateVehicle);
router.delete(
  "/:vehicleId",
  auth(Roles.admin),
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
