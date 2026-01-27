import { Request, Response } from 'express';
import UserModel from '../models/user_model';

const createUser = async (req: Request, res: Response) => {
  try {
    const userBody = req.body;
    const user = await UserModel.create(userBody);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findByIdAndDelete(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
