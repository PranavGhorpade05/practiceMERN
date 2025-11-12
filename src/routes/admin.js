// routes/admin.js
import express from "express";
import {
  getAllUsers,
  editUser,
  deleteUser,
  getAllPosts,
  deletePost,
  getAnalytics,
} from "../controller/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

// 👥 User management
router.get("/users", getAllUsers);
router.put("/users/:id", editUser);
router.delete("/users/:id", deleteUser);

// 📝 Post management
router.get("/posts", getAllPosts);
router.delete("/posts/:id", deletePost);

// 📊 Analytics
router.get("/analytics", getAnalytics);

export default router;
