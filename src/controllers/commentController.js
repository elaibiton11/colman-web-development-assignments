const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

async function addComment(req, res) {
  try {
    const { postId, sender, message } = req.body;
    if (!postId || !sender || !message) {
      return res.status(400).json({ error: 'postId, sender and message are required' });
    }
    
    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: 'Post not found for given postId' });
    const created = await Comment.create({ postId, sender, message });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}