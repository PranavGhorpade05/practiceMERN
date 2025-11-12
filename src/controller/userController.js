// controllers/userController.js
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl, coverUrl } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatarUrl, coverUrl },
      { new: true }
    ).select("-passwordHash");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("friends", "name username avatarUrl");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const query = q.trim();
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("name username avatarUrl bio _id")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
