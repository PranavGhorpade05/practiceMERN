// controllers/messageController.js
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { to, text } = req.body;

    const message = await Message.create({
      from: req.user.id,
      to,
      text,
      conversationId: [req.user.id, to].sort().join("_"),
    });

    // Emit via socket (optional)
    if (req.io) req.io.to(to).emit("receive_message", message);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversationId = [req.user.id, userId].sort().join("_");

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversationsList = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
    }).sort({ createdAt: -1 });

    const uniqueConvos = {};
    messages.forEach((msg) => {
      const other = msg.from.equals(req.user.id) ? msg.to : msg.from;
      if (!uniqueConvos[other]) uniqueConvos[other] = msg;
    });

    res.json(Object.values(uniqueConvos));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
