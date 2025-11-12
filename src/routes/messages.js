// routes/messages.js
import express from "express";
import {
  sendMessage,
  getConversation,
  getConversationsList,
} from "../controller/messageController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/conversations", verifyToken, getConversationsList);
router.get("/:userId", verifyToken, getConversation);

export default router;
