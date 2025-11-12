// routes/posts.js
import express from "express";
import {
  createPost,
  getFeed,
  likePost,
  commentOnPost,
  getTrending,
  deletePost,
} from "../controller/postController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/feed", verifyToken, getFeed);
router.post("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, commentOnPost);
router.delete("/:id", verifyToken, deletePost);
router.get("/trending/topics", getTrending);

export default router;
