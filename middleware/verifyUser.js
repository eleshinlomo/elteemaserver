import mongoose from "mongoose";
import { Users } from "../models/userData.js";

export const verifyUser = async (req, res, next) => {
  try {
    const userId =
      req.headers["userid"] ||
      req.headers["userId"] ||
      req.headers["user-id"];

    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: "Missing user ID in headers",
      });
    }

    // Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid user ID format",
      });
    }

    const user = await Users.findById(userId); // no need to wrap in ObjectId, findById handles it

    if (!user) {
      return res.status(403).json({
        ok: false,
        error: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("verifyUser error:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
};
