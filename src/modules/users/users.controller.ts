import { Request, Response } from "express";
import { userService } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("fetching user");
    const result = await userService.getAllUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const data = req.body;
  const loggedInUser = req.user as { id: string; role: string };
  // console.log("Logged in user", loggedInUser);

  if (!loggedInUser) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }

  if (
    loggedInUser.role !== "admin" &&
    String(loggedInUser.id) !== String(userId)
  ) {
    return res.status(403).json({
      message: "Forbidden: You can only update your own profile",
      success: false,
    });
  }

  if (loggedInUser.role !== "admin") {
    delete data.role;
    delete data.password;
  }

  try {
    const result = await userService.updateUser(
      userId as string,
      data.name,
      data.email,
      data.phone,
      data.role
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    delete result.rows[0].password;

    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
      success: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const result = await userService.deleteUser(userId as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
