// controllers/postController.js
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { content, media, tags } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Post content is required" });
    }

    if (content.length > 5000) {
      return res.status(400).json({ message: "Post content is too long" });
    }

    const post = await Post.create({
      author: req.user.id,
      content: content.trim(),
      media: media || [],
      tags: tags || [],
    });

    const populatedPost = await post.populate(
      "author",
      "name avatarUrl username"
    );

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Show posts from user, friends, and all other users (public posts)
    const posts = await Post.find()
      .populate("author", "name avatarUrl username")
      .populate("comments.author", "name avatarUrl username")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(req.user.id);
    if (liked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();

    res.json({ message: liked ? "Unliked" : "Liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ message: "Comment is too long" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      author: req.user.id,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.json({ message: "Comment added", commentCount: post.comments.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTrending = async (req, res) => {
  try {
    const trending = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
