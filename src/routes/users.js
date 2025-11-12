// routes/users.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getFriends,
  searchUsers,
} from "../controller/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", verifyToken, searchUsers);
router.get("/:id", verifyToken, getUserProfile);
router.put("/update", verifyToken, updateUserProfile);
router.get("/:id/friends", verifyToken, getFriends);

export default router;
