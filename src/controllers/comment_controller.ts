import { Request, Response } from 'express';
import CommentModel from '../models/comment_model';
import PostModel from '../models/post_model';

const addComment = async (req: Request, res: Response) => {
  try {
    const { postId, sender, message } = req.body;
    if (!postId || !sender || !message) {
      return res.status(400).json({ error: 'postId, sender and message are required' });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(400).json({ error: 'Post not found for given postId' });
    }

    const created = await CommentModel.create({ postId, sender, message });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const filter = req.query.post ? { postId: req.query.post } : {};
    const items = await CommentModel.find(filter).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const c = await CommentModel.findById(id).lean();
    if (!c) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { postId, sender, message } = req.body;
    if (!postId || !sender || !message) {
      return res.status(400).json({ error: 'postId, sender and message are required' });
    }

    const updated = await CommentModel.findByIdAndUpdate(
      id,
      { postId, sender, message },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await CommentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

const getCommentByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 }).lean();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

export default {
  addComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
  getCommentByPostId,
};
