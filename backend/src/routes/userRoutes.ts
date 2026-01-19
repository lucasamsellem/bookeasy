import { Router } from 'express';
import { getUsers, createUser, deleteUser, getUserById } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);
