import { Request, Response } from 'express';
import PostModel from '../models/post_model';

const createPost = async (req: Request, res: Response) => {
  try {
    const postBody = req.body;
    const post = await PostModel.create(postBody);
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query.sender ? { sender: req.query.sender } : {};
  try {
    const posts = await PostModel.find(filter);
    res.send(posts);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findByIdAndUpdate(postId, req.body, { new: true });
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findByIdAndDelete(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};