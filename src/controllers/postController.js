const Post = require('../models/postModel');

async function addPost(req, res) {
  try {
    const { title, content, sender } = req.body;
    if (!title || !content || !sender) {
      return res.status(400).json({ error: 'title, content and sender are required' });
    }
    const created = await Post.create({ title, content, sender });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addPost };
