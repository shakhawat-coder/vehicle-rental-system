import express from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth.middleware";
import { Roles } from "../auth/auth.constant";
const router = express.Router();

router.get("/", auth(Roles.admin), userController.getAllUsers);
router.put(
  "/:userId",
  auth(Roles.admin, Roles.customer),
  userController.updateUser
);
router.delete("/:userId", auth(Roles.admin), userController.deleteUser);
export const userRoutes = router;
