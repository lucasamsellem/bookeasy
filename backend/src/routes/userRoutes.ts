import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);
