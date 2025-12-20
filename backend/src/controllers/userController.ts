import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService';
import { User } from '../models/User';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndDelete(id);
  res.status(204).json({ message: 'User deleted successfully' });
};
