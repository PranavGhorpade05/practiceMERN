// controllers/adminController.js
import User from "../models/User.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, bio },
      { new: true }
    ).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.json({
      totalUsers,
      totalPosts,
      totalMessages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
